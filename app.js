"use strict";
const port = process.env.PORT || 3000;
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const bodyParser = require("body-parser");
const db = require("./utils/database");
const { blockAceesUrl, checkRefer } = require("./middlewares/users");
var hpp = require("hpp");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
let cors = require("cors");
const SearchAnimeTVCrawler = require("./crawler/searchAnimeTVCrawler");
const AnimeTVDetailCrawler = require("./crawler/animeTVDetailCrawler");
const PlayerCrawler = require("./crawler/playerCrawler");
const { HandleMp4Anime } = require("./controllers/handleMp4Anime");

app.use(cookieParser());
app.enable("trust proxy", 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set templating Engine
app.set("views", "./views");
app.use(expressLayouts);
app.set('layout', './layouts/full-width.ejs');
app.set("view engine", "ejs");
app.use(cors());

routes(app);
app.use(function (req, res, next) {
    delete req.headers["Origin"]; // should be lowercase
    next();
});
// const blockPostman = (req, res, next) => {
//   const userAgent = req.get("User-Agent");
//   console.log(userAgent);
//   if (userAgent && userAgent.includes("PostmanRuntime")) {
//     return res.status(403).json({ status: 403, message: "Forbidden: Requests from Postman are not allowed.", data: [] });
//   }
//   next();
// };
// app.use(blockPostman);
// Sử dụng express.static cho tất cả các tài nguyên tĩnh
app.use(express.static("public"));
app.use("/uploadLocal", express.static("uploadLocal"));

app.use(hpp());

app.use(
    session({
        secret: "the-super-strong-secrect",
        saveUninitialized: true,
        cookie: { maxAge: 31536000 },
        resave: true,
    })
);

app.get("*", function (req, res) {
    res.json({ status: 404, contact: "https://t.me/NodejsdevBE" });
});

// AnimeDetailCrawler('once');
// PlayerCrawler('wind-breaker', 4)
// SearchAnimeTVCrawler('one');
// AnimeTVDetailCrawler('/phim/one-piece-dao-hai-tac/');

// const fileUrl = 'https://web.lotuscdn.vn/2024/4/5/999a93a4f9f8bc7ec47fe7773e20e5da_1712262322238-4a7hfqdes5.mp4';
// HandleMp4Anime(fileUrl).then((details) => {
//     if (details) {
//         console.log('File Details:', details);
//     } else {
//         console.log('Failed to fetch file details.');
//     }
// });
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app;
