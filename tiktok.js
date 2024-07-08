const db = require("./utils/database");
const { google } = require("googleapis");
const fs = require("fs");
const TOKEN_PATH = "./token.json";
const token = fs.readFileSync(TOKEN_PATH, "utf-8");
const CLIENT_ID = "687888841115-34c251bnlgvddccguoq83n9b8d00ptal.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials(JSON.parse(token));
const path = require("path");
const drive = google.drive({ version: "v3", auth: oAuth2Client });
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-17178.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17178,
  password: "kFFIOZ912kePhOVdDNu8EjS9Dac8524F",
});
const { promisify } = require("util");
const FormData = require("form-data");
const axios = require("axios");
const axiosRetry = require("axios-retry");
axiosRetry(axios, { retries: 3 });
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);

let objectArray = [
  {
    id1: "7351306463366758401",
  },
  {
    id2: "7351306390440345601",
  },
  {
    id3: "7351306246554714114",
  },
  {
    id4: "7351310992803905537",
  },
  {
    id5: "7351310883938418690",
  },
  {
    id6: "7351310860213649409",
  },
  {
    id7: "7351347137847787522",
  },
  {
    id8: "7351346900269891585",
  },
  {
    id9: "7351346851678912514",
  },
  {
    id10: "7351355257923928065",
  },
  {
    id11: "7351356534674259970",
  },
  {
    id12: "7351356402214060034",
  },
  {
    id13: "7351356304629366785",
  },
  {
    id14: "7351361671052492802",
  },
  {
    id15: "7351363377903435777",
  },
  {
    id16: "7351363288057413633",
  },
  {
    id17: "7351363198966136833",
  },
  {
    id18: "7351374966123937793",
  },
  {
    id19: "7351377079335665665",
  },
  {
    id20: "7351376927263096833",
  },
  {
    id21: "7351376883432407042",
  },
  {
    id22: "7351384191713705985",
  },
  {
    id23: "7351388238180827137",
  },
  {
    id24: "7351388161903378433",
  },
  {
    id25: "7351388045062717441",
  },
  {
    id26: "7351410165809250306",
  },
  {
    id27: "7351392135113064449",
  },
  {
    id28: "7351392037746343937",
  },
  {
    id29: "7351391946763419649",
  },
  {
    id30: "7351394015058739202",
  },
  {
    id31: "7351395749789646850",
  },
  {
    id32: "7351395610295156738",
  },
  {
    id33: "7351395540799586306",
  },
  {
    id34: "7351400243898056705",
  },
  {
    id35: "7351406049760182273",
  },
  {
    id36: "7351405938533728257",
  },
  {
    id37: "7351405801900392450",
  },
  {
    id38: "7351408810886496257",
  },
  {
    id39: "7351410373506990082",
  },
  {
    id40: "7344285787485126657",
  },
];
async function printNextId() {
  const index = printNextId.index || 0;
  const key = "id" + ((index % 40) + 1); // Sử dụng toán tử % để lặp lại từ 1 đến 4
  if (key in objectArray[index % 40]) {
    const id = objectArray[index % 40][key];
    printNextId.index = index + 1; // Tăng chỉ số index để lấy id tiếp theo
    return id;
  } else {
    return undefined;
  }
}

async function getRandomUnprocessedUUID() {
  let connection = await db.getConnection();
  try {
    const [[uuidData]] = await connection.query("SELECT uuid FROM hin_drive WHERE isDeleted IS NULL AND status = 2 AND isTiktok IS NULL ORDER BY RAND() DESC LIMIT 1");

    if (!uuidData || uuidData.length === 0) {
      return null;
    }
    const uuid = uuidData.uuid;

    // const isProcessedKey = `processed:${uuid}`;

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
function sleep(minutes) {
  const milliseconds = minutes * 60 * 1000; // Chuyển đổi phút thành mili giây
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
async function performUpload() {
  let connection = await db.getConnection();

  let uuid = await getRandomUnprocessedUUID();
  try {
    if (!uuid) {
      console.log("Không có UUID nào cần xử lý.");
      return;
    }
    const maxRetryAttempts = 1000000000;
    const retryDelay = 1500;
    let dataTiktok = [];
    const [[configDelete]] = await connection.query(`SELECT isDeletedFile FROM hin_config WHERE id = 2`);
    const [[cookieData]] = await connection.query(`SELECT data FROM hin_cookie WHERE id = 1`);
    if (!cookieData) {
      connection.release();
      return console.log("Please update cookie for tools tiktok");
    }
    const cookie = cookieData?.data || "";
    const regex = /msToken=([^;]+)/;
    const match = cookie.match(regex);
    const token = match[1];
    let pathFolder = `./public/videos/${uuid}/lh3`;
    let pathFolderTiktok = `./public/videos/${uuid}/lh3`;
    const files = fs.readdirSync(pathFolder).filter((file) => {
      const fileExtension = path.extname(file).toLowerCase();
      if (file.includes("yanp2p") && fileExtension === ".png") {
        return true;
      }
      return false;
    });

    let isDeletedFile = fs.readdirSync(pathFolder).filter((file) => {
      const fileExtension = path.extname(file).toLowerCase();
      return fileExtension === ".png" || fileExtension === ".ts" || fileExtension === ".mp4";
    });
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    let sort = await files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
    let retryCount = 0;
    const uploadFile = async (filePath) => {
      try {
        const id = await printNextId();
        let form = new FormData();
        const headers = {
          "x-tt-logid": "20240611132303000000000000095AF34",
          "x-creative-csrf-token": "uEFD2meN-IVm5VBeXnyEf8NB1Wbkb_bOZ0YM",
          "x-csrftoken": "roM7tElVDgZVUBNwsQnNER1uyQRqYh3q",
          cookie: cookie,
        };
        const pathImages = `./public/videos/${uuid}/lh3/${filePath}`;
        form.append("Filedata", fs.createReadStream(pathImages));

        const response = await axios.post(`https://ads.tiktok.com/api/v3/i18n/material/image/upload/?aadvid=7344285787485126657&bc_id=`, form, { headers, timeout: 60000 });
        dataTiktok.push({ url: response.data.data.url?.replace("p21", "p16"), path: filePath });
        console.log(`Uploaded ${filePath}  : ${id} : ${response.data.data.url} :  ${uuid}`);
        if (response.data.data.url == undefined) {
          throw new Error("Error upload file");
        }
      } catch (error) {
        console.error(`Error uploading ${filePath}: ${error}`);
        if (retryCount >= maxRetryAttempts) {
          console.error(`Max retry attempts reached for ${filePath}`);
          return;
        }
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, delay));
        await uploadFile(filePath, retryCount);
      }
    };
    const maxConcurrentRequests = 10; // Số lượng tối đa các file được upload cùng một lúc
    const totalFilesToUpload = 200; // Tổng số file cần upload
    const timeToPause = 32 * 60 * 1000; // Thời gian dừng tính bằng mili giây (ở đây là 10 phút)
    let filesUploaded = 0; // Biến đếm số lượng file đã upload
    for (let i = 0; i < sort.length; i += maxConcurrentRequests) {
      const chunk = sort.slice(i, i + maxConcurrentRequests);
      const uploadPromises = chunk.map((file) => uploadFile(file));
      await Promise.all(uploadPromises);

      filesUploaded += chunk.length;

      // Kiểm tra nếu đã upload đủ số lượng file thì dừng chương trình trong 10 phút
      if (filesUploaded >= totalFilesToUpload) {
        console.log("Tạm Ngừng Chờ Reset Limited Cookies 30 Phút...");
        await new Promise((resolve) => setTimeout(resolve, timeToPause));
        filesUploaded = 0; // Đặt lại biến đếm sau khi đã dừng
      }
    }
    dataTiktok.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: "base" }));
    const inputString = await new Promise((resolve, reject) => {
      fs.readFile(`${pathFolder}/video.m3u8`, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    let currentIndex = 0;
    const pattern = /http:\/\/[^\s]+/g;
    const result = inputString.replace(pattern, () => {
      const replacement = dataTiktok[currentIndex % dataTiktok.length].url;
      currentIndex++;
      return replacement;
    });
    const writePromises = [];
    writePromises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(`./${pathFolderTiktok}/data.json`, JSON.stringify(dataTiktok), "utf-8", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
    );

    writePromises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(`./${pathFolderTiktok}/noah_yan.m3u8`, result, "utf-8", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
    );

    writePromises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(`./${pathFolderTiktok}/noah_yan.txt`, result, "utf-8", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
    );

    await Promise.all(writePromises);
  } catch (err) {
    await connection.query(`UPDATE hin_drive SET status = 99 WHERE uuid = ?`, [uuid]);
    console.log(uuid);
    connection.release();
    return console.log("lỗi", err);
  } finally {
    try {
      await connection.query(`UPDATE hin_drive SET isTiktok = 1 WHERE uuid = ?`, [uuid]);
      await connection.commit();
      connection.release();
      console.log("sucessed : ", uuid);
      const workerInterval = 0.1 * 60 * 1000; // 5 phút
      setTimeout(async () => {
        await performUpload();
      }, workerInterval);
    } catch (err) { }
  }
}

performUpload();
