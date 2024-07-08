const db = require("./utils/database");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const partitionPath = "/dev/vda2";
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

async function wokers() {
  // const { partition, size, used, available, percentage } = await getDiskUsageInfo(partitionPath);
  const connection = await db.getConnection();
  const outputPattern = "yanp2p_20_%d.ts";
  let destinationPath = "";
  let uuid = "";
  try {
    // if (parseFloat(percentage) > 90) {
    //   connection.release();
    //   return console.log("Your disk not available, please wait upload done");
    // }
    const [data] = await connection.query(`SELECT id, uuid, link, isEncode, name, status, mime_type FROM hin_drive WHERE isDoubleEnc = 1 AND isDeleted IS NULL ORDER BY id ASC`);
    if (data.length == 0) {
      connection.release();
      return console.log("No new record in database");
    }
    let [[configDomain]] = await connection.query(`SELECT data FROM hin_config WHERE id = 1`);
    let JsonDomain = JSON.parse(configDomain.data);
    let isAllowDomain = JsonDomain.domain || [];
    for (let i = 0; i < data?.length; i++) {
      try {
        destinationPath = `./public/videos/${data[i].uuid}/lh3`;
        let filePath = data[i].link ? `${destinationPath}/${data[i].link + "." + data[i].mime_type}` : `./uploadLocal/${data[i].name}`;
        uuid = data[i].uuid;
        console.log(uuid);
        const mimeType = data[i].mime_type;
        if (mimeType === "mkv" && data[i].isEncode == 1) {
          await new Promise((resolve, reject) => {
            ffmpeg(filePath)
              .videoCodec("copy")
              .audioCodec("copy")
              .outputOptions(["-y"])
              .output(`${destinationPath}/${data[i].link}.mp4`)
              .on("end", async () => {
                try {
                  await connection.query(`UPDATE hin_drive SET mime_type = 'mp4', isEncode = 0 WHERE uuid = ?`, [uuid]);
                  resolve();
                } catch (error) {
                  console.log(error);
                  reject(error);
                }
              })
              .on("error", (err) => {
                console.error("Lỗi chuyển đổi:", err);
                reject(err);
              })
              .run();
          });
        } else {
          await new Promise((resolve, reject) => {
            ffmpeg(filePath)
              .videoCodec("copy")
              .audioCodec("copy")
              .outputOptions(["-f hls", "-hls_time 1", `-hls_segment_filename ./${destinationPath + "/" + outputPattern}`, "-hls_playlist_type vod"])
              .output(destinationPath + "/yanlist.m3u8")
              .on("end", async () => {
                try {
                  await connection.query(`UPDATE hin_drive SET status = 2, isDoubleEnc = 2, isHls = 1, isLh3 = 1 WHERE uuid = ?`, [uuid]);
                  connection.release();

                  await fs.writeFile(destinationPath + "/master.m3u8", "#EXTM3U\n##EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\nyanlist.m3u8", function (err) {
                    if (err) throw err;
                  });
                  await fs.writeFile(destinationPath + "/master.txt", "#EXTM3U\n##EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\nyanlist.txt", function (err) {
                    if (err) throw err;
                  });
                  await fs.writeFile(destinationPath + "/index.m3u8", "#EXTM3U\n##EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\nvideo.m3u8", function (err) {
                    if (err) throw err;
                  });
                  await fs.readdir(destinationPath, (err, files) => {
                    if (err) throw err;
                    var contentImages = fs.readFileSync("./services/20x20.png");
                    files.forEach((file) => {
                      if (path.extname(file) === ".ts") {
                        const filePath = path.join(destinationPath, file);
                        const contentBuffer = fs.readFileSync(filePath);
                        const modifiedContentBuffer = Buffer.from(contentBuffer);
                        const searchString = Buffer.from("FFmpeg", "utf-8");
                        const replaceString = Buffer.alloc(searchString.length);
                        const index = modifiedContentBuffer.indexOf(searchString);
                        if (index !== -1) {
                          modifiedContentBuffer.fill(replaceString, index, index + searchString.length);
                        }
                        const combine = Buffer.concat([contentImages, modifiedContentBuffer]);
                        const nameData = file?.split(".");
                        fs.writeFileSync(`${destinationPath}/${nameData[0]}.png`, combine);
                        fs.promises.unlink(filePath);
                      }
                    });
                  });
                  const dataLines = await fs.promises.readFile(path.join(destinationPath, "yanlist.m3u8"), "utf8");
                  const lines = dataLines.split("\n");
                  let domainIndex = 0;
                  const newLines = lines.map((line) => {
                    if (line.endsWith(".ts")) {
                      const currentDomain = isAllowDomain[domainIndex];
                      domainIndex = (domainIndex + 1) % isAllowDomain.length;
                      return currentDomain + `/videos/${uuid}/lh3/` + line.replace(".ts", ".png");
                    }
                    return line;
                  });
                  const newPlaylist = newLines.join("\n");
                  await fs.promises.writeFile(path.join(destinationPath, "video.m3u8"), newPlaylist);
                  await fs.promises.writeFile(path.join(destinationPath, "video.txt"), newPlaylist);

                  resolve();
                } catch (err) {
                  console.log("lỗi này nè ", err);
                  await connection.query(`UPDATE hin_drive SET isDoubleEnc = 1 WHERE uuid = ?`, [uuid]);
                  reject(err);
                }
              })
              .on("error", async (err) => {
                await connection.query(`UPDATE hin_drive SET isDoubleEnc = 1 WHERE uuid = ?`, [uuid]);
                reject(err);
              })
              .run();
          });
        }
      } catch (error) {
        console.error("Lỗi xử lý video:", error);
        await connection.query(`UPDATE noah_drive SET status = 2 WHERE uuid = ?`, [uuid]);
      }
    }
    connection.release();
  } catch (error) {
    console.error("Lỗi truy vấn SQL:", error);
    await connection.query(`UPDATE noah_drive SET status = 99 WHERE uuid = ?`, [uuid]);
  } finally {
    try {
      const workerInterval = 0.2 * 60 * 1000; // 5 phút
      setTimeout(async () => {
        await wokers();
      }, workerInterval);
    } catch (err) {
      await connection.query(`UPDATE noah_drive SET status = 99 WHERE uuid = ?`, [uuid]);
    }
  }
}

wokers();
