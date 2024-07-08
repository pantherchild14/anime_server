const { resolve } = require("path");
const db = require("../utils/database");
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-17178.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17178,
  password: "kFFIOZ912kePhOVdDNu8EjS9Dac8524F",
});
const useragent = require("useragent");

exports.play = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const { tiktok, hls, lotus, lh3, ytb, p2p } = req.query;
    const referer = req.headers.referer || req.headers.origin || "";
    let domain = "";
    let isAllow = 0;
    const cachedData = await redis.get(`play:${id}`);
    // if (cachedData) {
    //   const cachedDataParsed = JSON.parse(cachedData);
    //   return res.render(`${resolve("./views/play")}`, {
    //     data: cachedDataParsed.data,
    //     isAllowDomainScript: cachedDataParsed.isAllow,
    //   });
    // }
    if (!id) return res.json({ status: 404, message: "Error Play" });
    const connection = await db.getConnection();
    const [[data]] = await connection.query(`SELECT id, uuid, name, status, isLotus, isHLS, isTiktok FROM hin_drive WHERE uuid = ?`, [id]);
    const [[isAllowDomainScript]] = await connection.query(`SELECT data FROM hin_config WHERE id = 3`);

    try {
      domain = new URL(referer).origin;
    } catch (urlError) {
      domain = "";
    }
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);
    const domainFinal = isAllowDomainScript.data.domain;
    isAllow = domainFinal?.includes(domain) ? 1 : 0;
    console.log(isAllow);
    if (!data) return res.json({ status: 404, message: "Error Play" });
    let dataFormat = {};
    if (agent.os.family === "Windows" || agent.device.family === "Android") {
      if (hls === "true") {
        console.log('first')
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          // link: 'https://rapovideo.xyz/playlist/660f72280f85dc67f15c0a63/master.m3u8'
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
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/hin_yan.m3u8`,
        };
      }
      if (lh3 === "true") {
        dataFormat = {
          id: data.id,
          name: data.name,
          status: data.status,
          uuid: data.uuid || "",
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/k3dr.yan`,
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
          // link: `${req.protocol}://${req.headers.host}//videos/${data.uuid}/lh3/video.m3u8`,
          link: 'https://rapovideo.xyz/playlist/660f72280f85dc67f15c0a63/master.m3u8'
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
          link: `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/hin_yan.m3u8`,
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

    await redis.setex(`play:${id}`, 8 * 60 * 60, JSON.stringify({ data: dataFormat, isAllow }));
    connection.release();
    res.render(`${resolve("./views/play")}`, { data: dataFormat, isAllowDomainScript: isAllow });
  } catch (err) {
    return res.json({ status: 404, message: "Error Play" });
  }
};
