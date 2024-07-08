const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.KEY_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Internal server error");
  }
}

testConnection();

async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("Error getting database connection:", error);
    throw new Error("Internal server error");
  }
}

module.exports = { getConnection };