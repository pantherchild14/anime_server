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
const drive = google.drive({ version: "v3", auth: oAuth2Client });
const { checkDisk } = require("./utils");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const partitionPath = "/dev/vda2";
const path = require('path');
const axios = require('axios');


async function getDiskUsageInfo(partitionPath) {
  try {
    const { stdout } = await exec(`df -h ${partitionPath}`);
    const lines = stdout.split("\n");
    const lastLine = lines[lines.length - 2];
    const [partition, size, used, available, percentage] = lastLine.split(/\s+/);
    return { partition, used, size, available, percentage };
  } catch (error) {
    console.error(`Lỗi khi thực hiện lệnh df: ${error}`);
    throw error;
  }
}

const downloadFile = async (fileUrl, destinationPath, fileName) => {
  const response = await axios.get(fileUrl, { responseType: 'stream' });
  const filePath = path.join(destinationPath, fileName);

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

async function download() {
  // const { partition, size, used, available, percentage } = await getDiskUsageInfo(partitionPath);

  try {
    // if (parseFloat(percentage) > 90) {
    //   return console.log("Your disk not available, please wait upload done");
    // }
    const connection = await db.getConnection();
    const [data] = await connection.query(`SELECT uuid, link, link_mp4, mime_type, status FROM hin_drive WHERE status = 0 AND isDoubleEnc IS NULL AND isDeleted IS NULL ORDER BY id ASC`);
    if (data.length == 0) {
      connection.release();
      return console.log("No new record in database");
    }
    if (data[0]?.link_mp4 !== null) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 0) {
          const destinationPath = `./public/videos/${data[i].uuid}/lh3`;
          const fileUrl = data[i]?.link_mp4;
          const extName = data[i]?.mime_type;

          const fileName = path.basename(fileUrl);

          if (!fs.existsSync(destinationPath)) {
            await fs.promises.mkdir(destinationPath, { recursive: true });
          }

          try {
            await downloadFile(fileUrl, destinationPath, fileName);
            await connection.query(`UPDATE hin_drive SET isDoubleEnc = 1 WHERE uuid = ?`, [data[i].uuid]);
          } catch (err) {
            console.error(`Error downloading ${fileName}: ${err}`);
            fs.unlinkSync(path.join(destinationPath, fileName));
          }
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 0) {
          const destinationPath = `./public/videos/${data[i].uuid}/lh3`;
          const fileId = data[i]?.link;
          const fileMetadata = await drive.files.get({
            fileId: fileId,
            fields: "name",
          });
          let fileName = fileMetadata.data.name;
          let extName = data[i]?.mime_type;
          if (!fs.existsSync(destinationPath)) {
            await fs.promises.mkdir(destinationPath, { recursive: true });
          }
          const filePath = `${destinationPath}/${data[i]?.link + "." + extName}`;
          const dest = fs.createWriteStream(filePath);
          const response = await drive.files.get({ fileId: fileId, alt: "media" }, { responseType: "stream" });
          await new Promise((resolve, reject) => {
            response.data
              .on("end", async () => {
                console.log(`Downloaded ${fileName}`);
                await connection.query(`UPDATE hin_drive SET isDoubleEnc = 1 WHERE uuid = ?`, [data[i].uuid]);
                resolve();
              })
              .on("error", (err) => {
                console.error(`Error downloading ${fileName}: ${err}`);
                dest.close();
                fs.unlinkSync(filePath);
                reject(err);
              })
              .pipe(dest);
          });
        }
      }
    }

    connection.release();
  } catch (error) {
    console.error(`Error fetching file information: ${error.message}`);
  } finally {
    const workerInterval = 0.2 * 60 * 1000; // 5 phút
    setTimeout(async () => {
      await download();
    }, workerInterval);
  }
}

download();
