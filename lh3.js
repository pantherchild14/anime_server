const { google } = require("googleapis");
const fs = require("fs");
const db = require("./utils/database");
const TOKEN_PATH = "./token.json";
const path = require("path");
const axios = require("axios");
const Redis = require("ioredis");

const token = fs.readFileSync(TOKEN_PATH, "utf-8");
const CLIENT_ID = "687888841115-34c251bnlgvddccguoq83n9b8d00ptal.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const { promisify } = require("util");

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials(JSON.parse(token));
const docs = google.docs({ version: "v1", auth: oAuth2Client });
const drive = google.drive({ version: "v3", auth: oAuth2Client });
let maxfileUpload = 5;

const redis = new Redis({
  host: "redis-17178.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17178,
  password: "kFFIOZ912kePhOVdDNu8EjS9Dac8524F",
});
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
async function getRandomUnprocessedUUID() {
  let connection = await db.getConnection();
  try {
    const [[uuidData]] = await connection.query("SELECT uuid FROM hin_drive WHERE isDeleted IS NULL AND status = 2 AND isDocs IS NULL   ORDER BY RAND() DESC LIMIT 1");

    if (!uuidData || uuidData.length === 0) {
      return null;
    }
    const uuid = uuidData.uuid;
    // const isProcessedKey = `isDocs:${uuid}`;
    // const isProcessed = await getAsync(isProcessedKey);
    // if (!isProcessed) {
    //   await setAsync(isProcessedKey, "1");
    //   return uuid;
    // } else {
    //   return getRandomUnprocessedUUID();
    // }
    return uuid;
  } finally {
    connection.release();
  }
}

async function extractImageSrcs(data) {
  const MAX_RETRIES = 3000000;
  let retries = 0;
  try {
    while (retries < MAX_RETRIES) {
      const dataLh3D = await Promise.all(
        data.map(async (item) => {
          try {
            const response = await axios.get(`https://docs.google.com/document/d/${item.docsID}/edit`, {
              timeout: 600000,
            });
            const html = response.data;
            // const regex = /https:\/\/lh7-us\.googleusercontent\.com[^'"]*/g;
            const regex = /https:\/\/lh7-us\.googleusercontent\.com\/[^\s'"]+/g;
            const matches = html.match(regex);
            if (matches) {
              const filteredMatches = matches
                .map((url) => url.replace("lh7-us", "lh3"))
                .filter((url) => url.includes("docs") && !url.includes("docsz"));
              return {
                path: item.fileName,
                url: filteredMatches,
              };
            } else {
              console.log(`No lh7 elements found for ${item.docsID}`);
              throw new Error("No lh7 elements found");
            }
          } catch (error) {
            console.error("Error fetching or parsing HTML:", error);
            throw error; // Ném lỗi để kích hoạt khối catch bên ngoài
          }
        })
      );
      return dataLh3D;
    }
  } catch (err) {
    console.log("Retrying...");
    retries++;
  }
}
async function creatDocsFinal(uuid) {
  try {
    const folderMetadata = {
      name: uuid,
      mimeType: "application/vnd.google-apps.folder",
    };
    const response = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });
    const folderId = response.data.id;
    const permissionMetadata = {
      role: "reader",
      type: "anyone",
    };
    await drive.permissions.create({
      resource: permissionMetadata,
      fileId: folderId,
    });
    return folderId;
  } catch (err) { }
}

async function createGoogleDoc(title, idDocs) {
  try {
    const fileMetadata = {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [idDocs], // Thêm ID của thư mục vào đây
    };
    const docs = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    return docs.data.id;
  } catch (err) { }
}

const insertImageFromDriveToGoogleDocs = async (uuid, idDocs) => {
  let data = [];
  const destinationPath = `./public/videos/${uuid}/lh3`;
  const files = fs.readdirSync(destinationPath).filter((file) => {
    const fileExtension = path.extname(file).toLowerCase();
    if (file.includes("yanp2p") && fileExtension === ".png") {
      return true;
    }
    return false;
  });

  let sort = await files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  let currentImageIndex = 0;

  async function uploadBatch(images) {
    const batchSize = maxfileUpload;
    const batchCount = Math.ceil(images.length / batchSize);

    for (let i = 0; i < batchCount; i++) {
      const batchImages = images.slice(i * batchSize, (i + 1) * batchSize);
      await uploadBatchImages(batchImages);
    }
  }

  async function uploadBatchImages(batchImages) {
    const uploadPromises = batchImages.map((image, index) => {
      const imageIndex = currentImageIndex++;
      return uploadImage(image, imageIndex, uuid);
    });
    await Promise.all(uploadPromises);
  }

  async function createImageToGoogleDrive(fileName, filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
      }
      const fileMetadata = {
        name: fileName,
      };
      const media = {
        mimeType: 'image/png',
        body: fs.createReadStream(filePath),
      };
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });

      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  }

  async function deleteFileFromGoogleDrive(fileId) {
    await drive.files.delete({
      fileId: fileId,
    });
  }

  async function uploadImage(fileName, index, uuid) {
    let retryCount = 0;
    const maxRetries = 3000000; // Số lần retry tối đa

    // nếu localhost khg cấp quyền thì sử dụng cách này
    // https://drive.google.com/uc?export=view&id=${driveFile.id}
    const filePath = `./public/videos/${uuid}/lh3/${fileName}`;
    const driveFileImage = await createImageToGoogleDrive(fileName, filePath);
    while (retryCount < maxRetries) {
      try {
        const docsID = await createGoogleDoc(fileName, idDocs);
        // const imageUrl = `http://localhost:3000/videos/${uuid}/lh3/${fileName}`;
        await docs.documents.batchUpdate({
          documentId: docsID,
          requestBody: {
            requests: [
              {
                insertInlineImage: {
                  uri: `https://drive.google.com/uc?export=view&id=${driveFileImage.id}`,
                  location: {
                    index: 1,
                  },
                },
              },
            ],
          },
        });
        console.log(fileName, uuid);
        await deleteFileFromGoogleDrive(driveFileImage.id);
        data.push({ fileName, docsID });
        return data;
      } catch (error) {
        console.log(error);
        retryCount++;
      }
    }
    console.error(`Reached maximum retry attempts for image ${fileName}`);
  }
  let currentIndex = 0;
  while (currentIndex < sort.length) {
    const batch = sort.slice(currentIndex, currentIndex + maxfileUpload);
    await uploadBatch(batch);
    currentIndex += maxfileUpload;
  }
  return data;
};

async function mainModule() {
  let connection = await db.getConnection();
  let uuid = await getRandomUnprocessedUUID();
  try {
    if (!uuid) {
      console.log("Không có UUID nào cần xử lý.");
      return;
    }
    console.log("UUID Lh3 :", uuid);
    const idDocs = await creatDocsFinal(uuid);
    console.log("idDocs : ", idDocs);

    const dataDocs = await insertImageFromDriveToGoogleDocs(uuid, idDocs);
    let finalSort = dataDocs.sort((a, b) => {
      const pathA = parseFloat(a.fileName.match(/yanp2p_20_(\d+)\.png/)[1]);
      const pathB = parseFloat(b.fileName.match(/yanp2p_20_(\d+)\.png/)[1]);
      return pathA - pathB;
    });
    const getLinkLh3 = await extractImageSrcs(finalSort);
    const pathFolder = `./public/videos/${uuid}/lh3/`;
    const inputString = fs.readFileSync(`${pathFolder}/video.m3u8`, "utf8");
    let currentIndex = 0;
    // const pattern = /https:\/\/[^\s]+/g;
    const pattern = /http:\/\/[^\s]+/g;
    const result = inputString.replace(pattern, () => {
      const replacement = getLinkLh3[currentIndex % getLinkLh3.length].url;
      currentIndex++;
      return replacement;
    });
    await fs.writeFileSync(`./${pathFolder}/dataLh3.json`, JSON.stringify(getLinkLh3), "utf-8");
    await fs.writeFileSync(`./${pathFolder}/noah.m3u8`, result, "utf-8");
    await fs.writeFileSync(`./${pathFolder}/noah.yan`, result, "utf-8");
    console.log("Image uploaded successfully to Google Docs!");
  } catch (error) {
    console.error("Error uploading image to Google Docs:", error);
  } finally {
    connection.release();
    try {
      await connection.query(`UPDATE hin_drive SET isDocs = 1 WHERE uuid = ?`, [uuid]);
      await connection.commit();
      connection.release();
      console.log("sucessed : ", uuid);
      const workerInterval = 0.1 * 60 * 1000;
      setTimeout(async () => {
        await mainModule();
      }, workerInterval);
    } catch (err) { }
  }
}
mainModule();
