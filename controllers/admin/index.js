const { resolve } = require("path");
const db = require("../../utils/database");
const moment = require("moment");
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const path = require("path");
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-17178.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17178,
  password: "kFFIOZ912kePhOVdDNu8EjS9Dac8524F",
});
const dotenv = require("dotenv");

const SearchAnimeCrawler = require('../../crawler/searchAnimeCrawler');
const AnimeDetailCrawler = require("../../crawler/animeDetailCrawler");
const useragent = require("useragent");
const SearchAnimeTVCrawler = require("../../crawler/searchAnimeTVCrawler");
const AnimeTVDetailCrawler = require("../../crawler/animeTVDetailCrawler");

dotenv.config();
// get 
exports.index = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }
    const [listDetailAnime] = await connection.query(`SELECT * FROM anime ORDER BY anime_id DESC`);
    let keyword = req.query.keyword;
    let dataSearch = [];
    if (keyword) {
      // const listAnime = await SearchAnimeCrawler(keyword);
      const listAnime = await SearchAnimeTVCrawler(keyword);
      for (let i = 0; i < listAnime?.list?.length; i++) {
        dataSearch.push({
          href: listAnime?.list[i]?.href,
          image: listAnime?.list[i]?.imageSrc,
          title: listAnime?.list[i]?.filmName,
        });
      }
      connection.release();
      return res.status(200).json({
        dataSearch: dataSearch,
        listDetailAnime: listDetailAnime,
      });
    }
    res.render(`${resolve("./views/erp/admin/index")}`, {
      dataSearch: dataSearch,
      listDetailAnime: listDetailAnime,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Error setting" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.detail = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }

    const paramHref = req.params['paramHref'];
    if (!paramHref) {
      res.render(`${resolve("./views/erp/admin/index")}`);
    }

    const values = [`%${paramHref}%`];
    const [listDetailAnime] = await connection.query(`SELECT * FROM anime WHERE paramHref LIKE ? ORDER BY anime_id DESC`, values);
    const [listEpisode] = await connection.query(`SELECT anime_id, episode_number FROM anime_ep WHERE anime_id = ? ORDER BY episode_number ASC`, [listDetailAnime[0].anime_id]);


    res.render(`${resolve("./views/erp/admin/detail")}`, {
      animeDetail: listDetailAnime[0],
      listEpisode: listEpisode,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Error detail anime" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.player = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }
    const { episodeNumber, paramHref } = req.params;
    const { tiktok, hls, lotus, lh3, ytb, p2p } = req.query;
    const referer = req.headers.referer || req.headers.origin || "";
    let domain = "";
    let isAllow = 0;

    if (!paramHref, !episodeNumber) {
      res.render(`${resolve("./views/erp/admin/index")}`);
    }
    try {
      domain = new URL(referer).origin;
    } catch (urlError) {
      domain = "";
    }

    const [[anime]] = await connection.query(`SELECT * FROM anime WHERE paramHref LIKE ? ORDER BY anime_id DESC`, [paramHref]);
    const [[isAllowDomainScript]] = await connection.query(`SELECT data FROM hin_config WHERE id = 3`);
    const [[data]] = await connection.query(`SELECT * FROM hin_drive WHERE anime_id = ? AND episode_number = ?`, [anime.anime_id, episodeNumber])
    const [[totalVideoHLS]] = await connection.query(`SELECT COUNT(id) as countHLS FROM hin_drive WHERE isDeleted IS NULL AND isHLS=1`);
    const [[totalVideoTiktok]] = await connection.query(`SELECT COUNT(id) countTiktok FROM hin_drive WHERE isDeleted IS NULL AND isTiktok=1`);
    const [[totalVideoLh3Docs]] = await connection.query(`SELECT COUNT(id) countDriverDocs FROM hin_drive WHERE isDeleted IS NULL AND isDocs=1`);

    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);
    const domainFinal = JSON.parse(isAllowDomainScript.data);
    isAllow = domainFinal.domain?.includes(domain) ? 1 : 0;
    if (!data) return res.json({ status: 404, message: "Error Play" });
    let dataFormat = {};

    let lh3Server;
    let hlsServer;
    let tiktokServer;
    console.log(totalVideoHLS, totalVideoTiktok, totalVideoLh3Docs);
    if (agent.os.family === "Windows" || agent.device.family === "Android") {
      hlsServer = `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/video.m3u8`;
      lh3Server = `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah.m3u8`;
      tiktokServer = `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah_yan.m3u8`;

      if (hls === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/video.m3u8`,
        };
      }
      if (p2p === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah.m3u8`,
        };
      }
      if (tiktok === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah_yan.m3u8`,
        };
      }
      if (lh3 === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          // link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/k3dr.yan`,
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah.m3u8`,
        };
      }
      if (ytb === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/${data.uuid}/ytb.yan`,
        };
      }
      if (lotus === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/${data.uuid}/lotus.txt`,
        };
      }
    } else {
      if (hls === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}//videos/${data.uuid}/lh3/video.m3u8`,
        };
      }

      if (p2p === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah.m3u8`,
        };
      }
      if (tiktok === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah_yan.m3u8`,
        };
      }

      if (ytb === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/${data.uuid}/ytb.m3u8`,
        };
      }

      if (lh3 === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/k3dr.m3u8`,
        };
      }

      if (lotus === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/${data.uuid}/lotus.m3u8`,
        };
      }
    }

    res.render(`${resolve("./views/erp/admin/player")}`, {
      data: dataFormat,
      anime: anime,
      episodeNumber: episodeNumber,
      isAllowDomainScript: isAllow,
      hlsServer: hlsServer,
      lh3Server: lh3Server,
      tiktokServer: tiktokServer,
      totalVideoHLS: totalVideoHLS,
      totalVideoTiktok: totalVideoTiktok,
      totalVideoLh3Docs: totalVideoLh3Docs,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Error detail anime" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deletedDrive = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }

    const { episodeNumber, animeID } = req.body; // Use req.body to retrieve data
    if (!episodeNumber || !animeID) { // Corrected logical operator
      res.status(501).json({ message: 'error req!!!' });
    }

    await connection.query(`DELETE FROM anime_ep WHERE anime_id = ? AND episode_number = ?`, [animeID, episodeNumber]);
    await connection.query(`DELETE FROM hin_drive WHERE anime_id = ? AND episode_number = ?`, [animeID, episodeNumber]);

    res.status(200).json({ message: "Episode deleted successfully" }); // Send JSON response
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Error deleting episode" }); // Corrected error message
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// post 

exports.crawlDetail = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }
    let url = req.body.url;
    if (url) {
      // await AnimeDetailCrawler(url);
      await AnimeTVDetailCrawler(url);
    }
    res.status(200).json({
      message: 'crawler success.',
      url: `${process.env.HOST_CRAWL_ANIME_TV}${url}`
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Error setting" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

