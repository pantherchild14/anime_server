
const db = require("../../utils/database");

exports.getAnime = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }

    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 20;

    const offset = (currentPage - 1) * pageSize;

    const query = `
      SELECT * FROM anime 
      ORDER BY update_time DESC
      LIMIT ? OFFSET ?
    `;

    const [data] = await connection.query(query, [pageSize, offset]);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
};


exports.getAnimeCategory = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Failed to connect to the database" });
    }

    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 20;

    const offset = (currentPage - 1) * pageSize;

    const query = `
      SELECT anime.*, COALESCE(SUM(av.view_total), 0) AS total_views
      FROM anime
      LEFT JOIN anime_view av ON anime.anime_id = av.anime_id
      GROUP BY anime.anime_id
      ORDER BY anime.update_time DESC
      LIMIT ? OFFSET ?;
    `;

    const [anime] = await connection.query(query, [pageSize, offset]);
    const [[countAnime]] = await connection.query('SELECT COUNT(*) AS total_anime FROM anime ORDER BY update_time DESC');

    res.status(200).json({ anime, countAnime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
};


// SELECT * FROM anime ORDER BY update_time DESC LIMIT 10 OFFSET 3;
