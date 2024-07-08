const db = require("./utils/database");
const { resolve } = require("path");
const path = require("path");
const fs = require("fs");
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-17178.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17178,
  password: "kFFIOZ912kePhOVdDNu8EjS9Dac8524F",
});
const { promisify } = require("util");
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
async function getRandomUnprocessedUUID() {

  let connection = await db.getConnection();
  try {
    const [[uuidData]] = await connection.query("SELECT uuid FROM hin_drive WHERE isDeleted IS NULL AND status = 2 ORDER BY id DESC LIMIT 1");

    if (!uuidData || uuidData.length === 0) {
      return null;
    }
    const uuid = uuidData.uuid;
    const isProcessedKey = `isDeleted:${uuid}`;
    const isProcessed = await getAsync(isProcessedKey);
    if (!isProcessed) {
      await setAsync(isProcessedKey, "1");
      return uuid;
    } else {
      return getRandomUnprocessedUUID();
    }
  } finally {
    connection.release();
  }
}

async function isDeleted() {
  let uuid = await getRandomUnprocessedUUID();
  let connection = await db.getConnection();
  try {
    if (!uuid) {
      console.log("Không có UUID nào cần xử lý.");
      return;
    }
    let pathFolder = `./public/videos/${uuid}/lh3`;
    let isDeletedFile = fs.readdirSync(pathFolder).filter((file) => {
      const fileExtension = path.extname(file).toLowerCase();
      return fileExtension === ".ts" || fileExtension === ".mp4";
    });

    await isDeletedFile.forEach((file) => {
      const fileExtension = path.extname(file).toLowerCase();
      if (fileExtension === ".ts" || fileExtension === ".mp4") {
        const filePath = path.join(pathFolder, file);
        fs.unlinkSync(filePath);
        console.log(`Đã xóa tệp: ${file}`);
      }
    });
    try {
      await connection.query(
        "UPDATE hin_drive SET isDeleted = 1 WHERE uuid = ?",
        [uuid]
      );
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log("không thể xóa file: ", uuid);
  } finally {
    try {
      const workerInterval = 0.1 * 60 * 1000;
      setTimeout(async () => {
        await isDeleted();
      }, workerInterval);
    } catch (err) {
      console.log("không thể xóa file");
    }
  }
}
isDeleted();
