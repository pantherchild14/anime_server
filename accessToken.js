const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.photos.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/photoslibrary.readonly",
  "https://www.googleapis.com/auth/documents",
];

// Thông tin xác thực
const CLIENT_ID = "687888841115-34c251bnlgvddccguoq83n9b8d00ptal.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const TOKEN_PATH = "./token.json";

// Khởi tạo client OAuth2
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

if (!fs.existsSync(TOKEN_PATH)) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify({}));
}

async function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this URL:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject("Error retrieving access token", err);

        // Lưu token vào tệp token.js
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return reject("Error writing token to file", err);
          console.log("Token stored in", TOKEN_PATH);
        });

        resolve(token);
      });
    });
  });
}

getAccessToken();
