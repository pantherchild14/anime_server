const { resolve } = require("path");
const db = require("../utils/database");
const { generateToken, comparePassword, verifyToken, hashPassword } = require("../utils");

exports.loginPage = async (req, res) => {
  try {
    const token = req.cookies.Bearer;
    console.log(token);
    if (!token) {
      return res.render(`${resolve("./views/erp/users/login")}`);
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    userFormat = {
      id: decoded.id,
    };
    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email, password) {
      const connection = await db.getConnection();
      const [[data]] = await connection.query(`SELECT * FROM hin_account WHERE email = ?`, [email]);
      if (!data) {
        connection.release();
        return res.redirect("/admin");
      }
      const checkPassword = await comparePassword(password, data.password);
      if (!checkPassword) {
        connection.release();
        return res.redirect("/admin");
      }
      const objectInfo = {
        id: data.id,
      };
      const token = generateToken(objectInfo);
      connection.release();
      res.cookie("Bearer ", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(200).json({ data: objectInfo, jwt: token });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const connection = await db.getConnection();
    const [[existingUser]] = await connection.query(`SELECT * FROM hin_account WHERE email = ?`, [email]);

    if (existingUser) {
      connection.release();
      return res.status(409).json({ message: 'Email already exists' });
    }

    const bcryptPassword = await hashPassword(password);
    await connection.query(`INSERT INTO hin_account(username, email, password) VALUES (?, ?, ?)`, [username, email, bcryptPassword]);

    const [[newUser]] = await connection.query(`SELECT * FROM hin_account WHERE email = ?`, [email]);
    const objectInfo = { id: newUser.id };

    const token = generateToken(objectInfo);
    connection.release();

    res.cookie("Bearer", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.status(200).json({ data: objectInfo, jwt: token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.postComment = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }

    const { comment_post_id, comment_author, comment_content, comment_type, user_id } = req.body;

    if (!comment_post_id || !comment_content || !comment_type) {
      return res.status(400).json({ message: "All fields except user_id are required" });
    }

    // If user_id is provided, check if it exists
    if (user_id) {
      const userCheckQuery = 'SELECT COUNT(*) as count FROM hin_account WHERE id = ?';
      const [userCheckResult] = await connection.query(userCheckQuery, [user_id]);

      if (userCheckResult[0].count === 0) {
        return res.status(400).json({ message: "Invalid user_id" });
      }
    }

    const query = `
      INSERT INTO anime_comment (comment_post_id, comment_author, comment_content, comment_type, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [comment_post_id, comment_author, comment_content, comment_type, user_id ?? null];

    await connection.query(query, values);
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: "An internal server error occurred" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


exports.getComments = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }

    const { comment_post_id } = req.params;

    if (!comment_post_id) {
      return res.status(400).json({ message: "comment_post_id is required" });
    }

    const getCommentsQuery = `
      SELECT * FROM anime_comment WHERE comment_post_id = ?
    `;
    const [comments] = await connection.query(getCommentsQuery, [comment_post_id]);

    const getCountQuery = `
      SELECT COUNT(*) as comment_total FROM anime_comment WHERE comment_post_id = ?
    `;
    const [countResult] = await connection.query(getCountQuery, [comment_post_id]);
    const commentTotal = countResult[0].comment_total;

    res.status(200).json({
      comments,
      commentTotal
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: "An internal server error occurred" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


