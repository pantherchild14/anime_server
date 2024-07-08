const { resolve } = require("path");
const db = require("../utils/database");
const { verifyToken } = require(resolve("utils"));

exports.checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.Bearer;
    if (!token) {
      return res.render(`${resolve("./views/erp/users/login")}`);
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const connection = await db.getConnection();
    const [[data]] = await connection.query(`SELECT * FROM hin_account WHERE id = '${decoded.id}'`);
    if (!data) {
      connection.release();
      return res.render(`${resolve("./views/erp/users/login")}`);
    }
    req.data = data;
    next();
    connection.release();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err.message });
  }
};
exports.auth = {
  required: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
      const decoded = verifyToken(token);
      req.auth = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ status: 401, error: "Unauthorized" });
    }
  },
  optional: (req, res, next) => {
    if (!req.headers.authorization) {
      return next();
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
      const decoded = verifyToken(token);
      req.auth = decoded;
      next();
    } catch (err) {
      return next();
    }
  },
};

exports.checkRefer = async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [[isAllowDomain]] = await connection.query(`SELECT data FROM hin_config WHERE id = 1`);
    const domain = isAllowDomain.data.domain;
    const referer = req.get("referer") || req.get("referrer");
    let refererOrigin;
    try {
      const refererURL = new URL(referer);
      refererOrigin = refererURL.origin;
    } catch (err) {
      await connection.release();
      return res.status(400).json({ error: "hehe :D" });
    }
    if (referer && domain?.includes(refererOrigin)) {
      next();
      await connection.release();
    } else {
      await connection.release();
      res.status(403).send("Hehe :D");
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Let me cook" });
  }
};

exports.blockAceesUrl = async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [[isAllowDomain]] = await connection.query(`SELECT data FROM hin_config WHERE id = 3`);
    const allowedDomains = isAllowDomain.data.domain;
    const originHeader = req.get("Origin");
    console.log(originHeader);
    if (!originHeader || !allowedDomains.includes(originHeader)) {
      await connection.release();
      return res.status(403).send("Access Denied");
    }

    next();
    await connection.release();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
