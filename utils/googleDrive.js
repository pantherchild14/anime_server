const { google } = require("googleapis");
const fs = require("fs");
const { file } = require("googleapis/build/src/apis/file");
const TOKEN_PATH = "./token.json";
const token = fs.readFileSync(TOKEN_PATH, "utf-8");
const CLIENT_ID = "687888841115-34c251bnlgvddccguoq83n9b8d00ptal.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials(JSON.parse(token));
const drive = google.drive({ version: "v3", auth: oAuth2Client });
const docs = google.docs({ version: "v1", auth: oAuth2Client });
const youtube = google.youtube({
  version: "v3",
  auth: oAuth2Client,
});
const axios = require("axios");

exports.uploadYoutube = async (path) => {
  try {
    const imageData = fs.readFileSync(path);
    const response = await youtube.channelSections.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          type: "allPlaylists", // Đổi thành giá trị phù hợp nếu cần
          style: "horizontalRow",
          position: 0,
          title: "Your image title", // Tiêu đề của hình ảnh
          // Mô tả của tab cộng đồng
          description: "Description of your community tab",
          // Cần cung cấp channelId của kênh
          channelId: "saminurabiu9344",
          // Tạo một tệp media với dữ liệu của hình ảnh
          media: {
            body: imageData,
          },
        },
      },
    });
    return response.data;
    console.log("Hình ảnh đã được đăng lên tab Cộng đồng:", response.data);
  } catch (error) {
    console.error("Lỗi:", error);
  }
};

exports.getVideoInfo = async (fileId) => {
  try {
    // Gọi API để lấy thông tin file
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: "name,mimeType,size",
    });

    return fileMetadata.data;
  } catch (error) {
    console.error(`Error fetching file information: ${error.message}`);
  }
};

exports.extractImageSrcs = async (data) => {
  const MAX_RETRIES = 30000; // Số lần thử lại tối đa
  let retries = 0;

  try {
    while (retries < MAX_RETRIES) {
      const dataLh3D = await Promise.all(
        data.map(async (item) => {
          try {
            const response = await axios.get(`https://docs.google.com/document/d/${item.docsid}/edit`, {
              timeout: 60000,
            });
            const html = response.data;
            const regex = /https:\/\/lh7-us\.googleusercontent\.com[^'"]*/g;
            const matches = html.match(regex);
            if (matches) {
              const filteredMatches = matches.filter((url) => !url.includes("docs"));
              return {
                path: item.path,
                url: filteredMatches,
              };
            } else {
              console.log("No lh7 elements found");
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
};

exports.getLh3 = async (fileId) => {
  try {
    // Gọi API để lấy thông tin file
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: "*",
    });

    return fileMetadata.data;
  } catch (error) {
    console.error(`Error fetching file information: ${error.message}`);
  }
};

exports.upload = async (imagePath, mimeType, name, folderName) => {
  const maxRetry = 3000; // Số lần retry tối đa
  let retryCount = 0;
  while (true) {
    try {
      // Tạo hoặc lấy ID của thư mục
      const fileMetadata = {
        name,
        parents: [folderName], // Thiết lập id của thư mục cha
      };

      // Thực hiện upload file
      const file = await new Promise((resolve, reject) => {
        const media = {
          mimeType,
          body: fs.createReadStream(imagePath),
        };

        drive.files.create(
          {
            resource: fileMetadata,
            media: media,
            fields: "webViewLink, id",
          },
          (err, file) => {
            if (err) {
              reject(err);
            } else {
              console.log("File ID:", file.data.id);
              resolve(file.data);
            }
          }
        );
      });

      return file.webViewLink;
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetry) {
        throw error;
      } else {
      }
    }
  }
};

exports.creatFolderDrive = async (folderName) => {
  const maxRetry = 3000;
  let retryCount = 0;
  while (retryCount < maxRetry) {
    try {
      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };

      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: "id",
      });

      await drive.permissions.create({
        fileId: folder.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      console.log("Created folder with ID:", folder.data.id);
      return folder.data.id;
    } catch (error) {
      retryCount++;
    }
  }

  console.log("Max retries reached, giving up.");
  return null;
};

exports.uploadLh3d = async (imagePath, mimeType, name, folderName) => {
  const maxRetry = 300000; // Số lần thử lại
  let retryCount = 0;

  const uploadFile = async () => {
    const fileMetadata = {
      name,
      parents: [folderName],
    };

    return new Promise((resolve, reject) => {
      const media = {
        mimeType,
        body: fs.createReadStream(imagePath),
      };

      drive.files.create(
        {
          resource: fileMetadata,
          media: media,
          fields: "webViewLink, id",
          supportsAllDrives: true,
        },
        async (err, file) => {
          if (err) {
            reject(err);
          } else {
            try {
              await drive.permissions.create({
                fileId: file.data.id,
                requestBody: {
                  role: "reader",
                  type: "anyone",
                },
              });
              resolve(file.data);
            } catch (error) {
              console.log(err.message);
              reject(error);
            }
          }
        }
      );
    });
  };

  const checkIfFileExists = async () => {
    return new Promise((resolve, reject) => {
      drive.files.list(
        {
          q: `'${folderName}' in parents and name='${name}' and trashed=false`,
          fields: "files(id)",
        },
        (err, res) => {
          if (err) {
            console.log(err.message);
            reject(err);
          } else {
            resolve(res.data.files.length > 0);
          }
        }
      );
    });
  };

  while (retryCount < maxRetry) {
    try {
      const fileExists = await checkIfFileExists();
      if (!fileExists) {
        const file = await uploadFile();
        console.log("File ID:", file.id);
        return file.webViewLink;
      } else {
        return null;
      }
    } catch (error) {
      retryCount++;
    }
  }
};

const checkIfDocsExists = async (fullName, idFolder) => {
  try {
    const response = await drive.files.list({
      q: `'${idFolder}' in parents and name='${fullName}' and trashed=false and mimeType='application/vnd.google-apps.document'`,
      fields: "files(id)",
    });

    return response.data.files.length > 0 ? response.data.files[0] : null;
  } catch (error) {
    throw new Error(`Error checking if document exists: ${error.message}`);
  }
};

exports.uploadDocs = async (name, idFolder, url) => {
  const maxRetry = 30000;
  let retryCount = 0;
  let dataDocs = [];
  while (retryCount < maxRetry) {
    try {
      const fullName = name;
      const existingDoc = await checkIfDocsExists(fullName, idFolder);

      if (!existingDoc) {
        const fileMetadata = {
          name: fullName,
          mimeType: "application/vnd.google-apps.document",
          parents: [idFolder],
        };

        const docResponse = await drive.files.create({
          resource: fileMetadata,
          fields: "id",
        });

        const idDocs = docResponse.data.id;
        const imageFileId = url.split("/")[5];
        console.log("Image File ID:", imageFileId);
        const response = await docs.documents.batchUpdate({
          documentId: idDocs,
          requestBody: {
            requests: [
              {
                insertInlineImage: {
                  uri: `https://drive.google.com/uc?id=${imageFileId}`,
                  location: {
                    index: 1,
                  },
                },
              },
            ],
          },
        });

        await drive.permissions.create({
          fileId: idDocs,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });

        console.log("Docs ID:", idDocs);
        dataDocs.push({ path: item.path, docsid: idDocs });
      } else {
        return null;
      }

      const delay = index * 1;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return dataDocs;
    } catch (err) {
      retryCount++;
      if (retryCount >= maxRetry) {
        throw new Error(`Failed to upload documents after ${maxRetry} attempts: ${err.message}`);
      }
    }
  }
};

exports.creatDocs = async (name) => {
  try {
    const fileMetadata = {
      name: name,
      mimeType: "application/vnd.google-apps.document",
    };
    const docs = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    return docs.data.id;
  } catch (err) { }
};
