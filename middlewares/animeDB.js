const db = require("../utils/database");

exports.animeDetailDB = async (data) => {
    let connection;
    try {
        connection = await db.getConnection();
        if (!connection) {
            return res.status(500).json({ message: "Failed to connect to the database" });
        }
        const [[checkQuery]] = await connection.query('SELECT COUNT(*) AS count FROM anime WHERE title = ?', [data[0].title]);
        const animeExists = checkQuery.count > 0;
        if (animeExists) {
            await connection.query(`
            UPDATE anime 
            SET
                alias = ?,
                description = ?,
                poster = ?,
                meta = ?,
                paramHref = ?,
                update_time = NOW()
            WHERE title = ?
        `, [data[0].alias, data[0].description, data[0].poster, JSON.stringify(data[0].meta), data[0].paramHref, data[0].title]);
        } else {
            await connection.query(`
                INSERT INTO anime 
                (
                    title, alias, description, poster, meta, paramHref
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `, [data[0].title, data[0].alias, data[0].description, data[0].poster, JSON.stringify(data[0].meta), data[0].paramHref]);
        }
    } catch (error) {
        console.log('Error processing anime detail:', error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

