const db = require("../utils/database");
const { resolve } = require("path");
const { getVideoInfo, downloadVideo } = require("../utils/googleDrive");
const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");
const PlayerCrawler = require("../crawler/playerCrawler");
const { HandleMp4Anime } = require("./handleMp4Anime");
const redis = new Redis({
  host: "redis-17178.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17178,
  password: "kFFIOZ912kePhOVdDNu8EjS9Dac8524F",
});

exports.getForm = async (req, res) => {
  try {
    return res.render(`${resolve("./views/erp/home/addDrive")}`);
  } catch (err) {
    console.log(err);
    return res.json({ status: 404, message: "Error Drive" });
  }
};

exports.addDrive = async (req, res) => {
  const { linkDrive, idAnime, episodeNumber, paramHref } = req.body;

  if (!idAnime || !episodeNumber || !paramHref) {
    return res.status(400).json({ status: 400, message: "Missing required fields" });
  }

  try {
    const connection = await db.getConnection();
    const animeCrawlHls = await PlayerCrawler(paramHref, episodeNumber);

    let created = {
      id: 1,
      time: Date.now(),
    };
    if (linkDrive) {
      const finalDrive = linkDrive.split(/\r?\n/).filter(Boolean);

      if (linkDrive.includes("drive.google.com")) {
        const queries = [];

        for (const driveLink of finalDrive) {
          const uuid = uuidv4();
          const id = driveLink.split("/")[5];
          const getVideo = await getVideoInfo(id);
          let mimeType = getVideo?.mimeType?.split("/")[1];

          if (mimeType === "x-matroska") mimeType = "mkv";
          if (mimeType === "vnd.dlna.mpeg-tts") mimeType = "ts";

          const [[checkExist]] = await connection.query(`SELECT id FROM hin_drive WHERE anime_id = ? AND episode_number = ?`, [idAnime, episodeNumber]);
          if (checkExist) {
            await connection.query(`
              UPDATE hin_drive 
              SET 
                uuid = ?,
                name = ?,
                size = ?,
                link = ?,
                status = ?,
                mime_type = ?,
                isEncode = ?,
                created = ?,
                anime_id = ?,
                episode_number = ?,
                arr_animetv = ?
              WHERE id = ?`,
              [
                uuid,
                getVideo.name,
                getVideo.size,
                id,
                0,
                mimeType,
                mimeType === "mkv" ? 1 : 0,
                JSON.stringify(created),
                idAnime,
                episodeNumber,
                JSON.stringify(animeCrawlHls?.anime),
                checkExist.id
              ]
            );
          } else {
            await connection.query(`
              INSERT INTO hin_drive (uuid, name, size, link, status, mime_type, isEncode, created, anime_id, episode_number, arr_animetv) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                uuid,
                getVideo.name,
                getVideo.size,
                id,
                0,
                mimeType,
                mimeType === "mkv" ? 1 : 0,
                JSON.stringify(created),
                idAnime,
                episodeNumber,
                JSON.stringify(animeCrawlHls?.anime)
              ]
            );
          }
        }

        // Thêm hoặc cập nhật bảng anime_ep
        const [[checkAnimeEpExist]] = await connection.query(`SELECT episodes_id FROM anime_ep WHERE anime_id = ? AND episode_number = ?`, [idAnime, episodeNumber]);
        if (!checkAnimeEpExist) {
          await connection.query(`
            INSERT INTO anime_ep (anime_id, episode_number) 
            VALUES (?, ?)`,
            [idAnime, episodeNumber]
          );
        }

        connection.release();
        return res.status(201).json({ status: 201, data: "Add drive success" });
      } else {
        connection.release();
        return res.status(400).json({ status: 400, message: "Invalid linkDrive format" });
      }
    } else {
      const [[checkExist]] = await connection.query(`SELECT id FROM hin_drive WHERE anime_id = ? AND episode_number = ?`, [idAnime, episodeNumber]);
      if (animeCrawlHls?.videoURLs[0] !== null) {
        HandleMp4Anime(animeCrawlHls?.videoURLs[0]).then(async (details) => {
          const mime_type = details.mime_type === "mkv" ? 1 : 0;

          if (checkExist) {
            await connection.query(`
                    UPDATE hin_drive 
                    SET name = ?,
                        size = ?,
                        link = ?,
                        link_mp4 = ?,
                        status = 0,
                        mime_type = ?,
                        isEncode = ?,
                        created = ?,
                        arr_animetv = ?
                    WHERE anime_id = ? AND episode_number = ?`,
              [
                details.name,
                details.size,
                details.link,
                details.link_mp4,
                details.mime_type,
                mime_type,
                JSON.stringify(created),
                JSON.stringify(animeCrawlHls?.anime),
                idAnime,
                episodeNumber
              ]
            );
          } else {
            await connection.query(`
                    INSERT INTO hin_drive (uuid, name, size, link, link_mp4, status, mime_type, isEncode, created, anime_id, episode_number, arr_animetv) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                details.uuid,
                details.name,
                details.size,
                details.link,
                details.link_mp4,
                0,
                details.mime_type,
                mime_type,
                JSON.stringify(created),
                idAnime,
                episodeNumber,
                JSON.stringify(animeCrawlHls?.anime)
              ]
            );
          }
        });
      } else {
        if (checkExist) {
          await connection.query(`
              UPDATE hin_drive 
              SET arr_animetv = ?
              WHERE anime_id = ? AND episode_number = ?`,
            [
              JSON.stringify(animeCrawlHls?.anime),
              idAnime,
              episodeNumber
            ]
          );
        } else {
          await connection.query(`
              INSERT INTO hin_drive (anime_id, episode_number, arr_animetv) 
              VALUES (?, ?, ?)`,
            [
              idAnime,
              episodeNumber,
              JSON.stringify(animeCrawlHls?.anime)
            ]
          );
        }
      }

      // Thêm hoặc cập nhật bảng anime_ep
      const [[checkAnimeEpExist]] = await connection.query(`SELECT episodes_id FROM anime_ep WHERE anime_id = ? AND episode_number = ?`, [idAnime, episodeNumber]);
      if (!checkAnimeEpExist) {
        await connection.query(`
          INSERT INTO anime_ep (anime_id, episode_number) 
          VALUES (?, ?)`,
          [idAnime, episodeNumber]
        );
      }

      connection.release();
      return res.status(201).json({ status: 201, data: "Add anime success" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Error Drive" });
  }
};

exports.restAPI = async (req, res) => {
  let connection = await db.getConnection();
  try {
    const { drive } = req.query;
    const splitDrive = drive?.split("/");
    const id = splitDrive[5];
    let uuid = uuidv4();
    const getVideo = await getVideoInfo(id);
    let mimeType = getVideo?.mimeType?.split("/")?.[1];
    mimeType = mimeType === "x-matroska" ? "mkv" : mimeType;
    if (mimeType === "x-matroska") {
      mimeType = "mkv";
    }
    if (mimeType === "vnd.dlna.mpeg-tts") {
      mimeType = "ts";
    }
    let created = {
      id: 1,
      time: Date.now(),
    };
    const [[checkExist]] = await connection.query(`SELECT id, uuid, isHLS, isLotus, isLh3, isTiktok, isDocs  FROM noah_drive WHERE link = ?`, [id]);
    if (checkExist) {
      connection.release();
      const datafomat = {
        lotus: checkExist.isLotus === 1 ? `${req.protocol}://${req.headers.host}/play/api/${checkExist.uuid}?lotus=true` : "Processing",
        tiktok: checkExist.isTiktok === 1 ? `${req.protocol}://${req.headers.host}/play/api/${checkExist.uuid}?tiktok=true` : "Processing",
        hls: checkExist.isHLS === 1 ? `${req.protocol}://${req.headers.host}/play/api/${checkExist.uuid}?hls=true` : "Processing",
        lh3: checkExist.isHLS === 1 ? `${req.protocol}://${req.headers.host}/play/api/${checkExist.uuid}?lh3=true` : "Processing",
        p2p: checkExist.isDocs === 1 ? `${req.protocol}://${req.headers.host}/play/api/${checkExist.uuid}?p2p=true` : "Processing",
      };
      return res.status(200).json({ status: 200, message: "Link đã tồn tại", link: datafomat });
    }

    await connection.query(`INSERT INTO noah_drive (uuid, name, size, link, status, mime_type, isEncode, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      uuid,
      getVideo.name,
      getVideo.size,
      id,
      0,
      mimeType,
      mimeType === "mkv" ? 1 : 0,
      JSON.stringify(created),
    ]);
    connection.release();
    return res.status(201).json({ status: 201, data: "Add drive success", link: `${req.protocol}://${req.headers.host}/play/api/${uuid}?hls=true }` });
  } catch (err) {
    console.log(err);
    return res.json({ status: 404, message: "Error Drive" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
