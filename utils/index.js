const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { exec } = require("child_process");
const { default: axios } = require("axios");
const path = require("path");
const fs = require('fs');

exports.checkDisk = async () => {
  const partitionPath = "/dev/vda2";
  exec(`df -h ${partitionPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Lỗi khi thực hiện lệnh df: ${error}`);
      return;
    }

    const lines = stdout.split("\n");
    const lastLine = lines[lines.length - 2];
    const [partition, size, used, available, percentage] = lastLine.split(/\s+/);
    console.log(`Phân vùng: ${partition}`);
    console.log(`Dung lượng đã sử dụng: ${used}`);
    console.log(`Dung lượng còn trống: ${available}`);
    console.log(`Phần trăm đã sử dụng: ${percentage}`);
  });
};

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (user) => {
  const { id } = user;
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// verifyToken
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


exports.downloadImage = async (imageUrl, fileName) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    const destinationPath = './public/images';

    if (!fs.existsSync(destinationPath)) {
      await fs.promises.mkdir(destinationPath, { recursive: true });
    }

    const filePath = path.join(destinationPath, fileName);
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image: ${error}`);
    throw error;
  }
};
