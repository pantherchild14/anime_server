const db = require("../../utils/database");
const useragent = require("useragent");

exports.getPlayer = async (req, res) => {
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

        try {
            domain = new URL(referer).origin;
        } catch (urlError) {
            domain = "";
        }

        const [[anime]] = await connection.query(
            `SELECT a.*, GROUP_CONCAT(DISTINCT e.episode_number ORDER BY e.episode_number ASC) AS episode_number 
             FROM anime a 
             LEFT JOIN anime_ep e ON a.anime_id = e.anime_id 
             WHERE a.paramHref = ? 
             GROUP BY a.anime_id;`,
            [paramHref]
        );

        if (!anime) {
            return res.status(404).json({ message: "Anime not found" });
        }

        if (!episodeNumber) {
            return res.status(200).json(anime);
        }

        const [[data]] = await connection.query(
            `SELECT a_dri.id, a_dri.uuid, a_dri.arr_animetv, GROUP_CONCAT(DISTINCT e.episode_number ORDER BY e.episode_number ASC) AS episode_number, av.view_total	
             FROM hin_drive a_dri
             JOIN anime_ep e ON a_dri.anime_id = e.anime_id
             JOIN anime a ON a_dri.anime_id = a.anime_id
             LEFT JOIN anime_view av ON a_dri.id = av.drive_id
             WHERE a_dri.episode_number = ? and a.paramHref = ?
             GROUP BY a_dri.id;`,
            [episodeNumber, paramHref]
        );

        if (!data) {
            return res.status(404).json({ message: "Episode not found" });
        }

        await connection.beginTransaction();
        const [[existingView]] = await connection.query(
            `SELECT view_id, view_total FROM anime_view WHERE drive_id = ?`,
            [data.id]
        );

        if (existingView) {
            await connection.query(
                `UPDATE anime_view SET view_total = view_total + 1 WHERE view_id = ?`,
                [existingView.view_id]
            );
        } else {
            await connection.query(
                `INSERT INTO anime_view (anime_id, drive_id, view_total) VALUES (?, ?, 1)`,
                [anime.anime_id, data.id]
            );
        }

        const [[updatedView]] = await connection.query(
            `SELECT view_total FROM anime_view WHERE drive_id = ?`,
            [data.id]
        );

        await connection.commit();

        const [[totalVideoHLS]] = await connection.query(
            `SELECT COUNT(id) as countHLS FROM hin_drive WHERE isDeleted IS NULL AND isHLS=1`
        );

        const [[totalVideoTiktok]] = await connection.query(
            `SELECT COUNT(id) as countTiktok FROM hin_drive WHERE isDeleted IS NULL AND isTiktok=1`
        );

        const [[totalVideoLh3Docs]] = await connection.query(
            `SELECT COUNT(id) as countDriverDocs FROM hin_drive WHERE isDeleted IS NULL AND isDocs=1`
        );

        const hlsServer = `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/video.m3u8`;
        const lh3Server = `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah.m3u8`;
        const tiktokServer = `${req.protocol}://${req.headers.host}/videos/${data.uuid}/lh3/noah_yan.m3u8`;

        return res.status(200).json({
            anime,
            anime_drive_id: data.id,
            animeVideoTV: data.arr_animetv,
            hlsServer,
            lh3Server,
            tiktokServer,
            episodeNumber,
            totalVideoHLS: totalVideoHLS.countHLS,
            totalVideoTiktok: totalVideoTiktok.countTiktok,
            totalVideoLh3Docs: totalVideoLh3Docs.countDriverDocs,
            viewAnime: updatedView.view_total
        });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        return res.status(500).json({ message: "Error fetching anime details" });
    } finally {
        if (connection) connection.release();
    }
};


// SELECT GROUP_CONCAT(episode_number ORDER BY episode_number ASC) AS episode_arr_number FROM anime_ep WHERE anime_id = 1 GROUP BY anime_id;
// SELECT anime_id, COUNT(*) as episode_count FROM anime_ep WHERE anime_id = 1 GROUP BY anime_id;

// SELECT a.*, GROUP_CONCAT(e.episode_number ORDER BY e.episode_number ASC) AS episode_number
// FROM anime a
// LEFT JOIN anime_ep e ON a.anime_id = e.anime_id
// WHERE a.paramHref = 'one-piece-film-red'
// GROUP BY a.anime_id;


// SELECT a.*, GROUP_CONCAT(e.episode_number ORDER BY e.episode_number ASC) AS episode_number
// FROM anime a
// JOIN anime_ep e ON a.anime_id = e.anime_id
// WHERE a.paramHref = 'one-piece-film-red'
// GROUP BY a.anime_id;

// SELECT a_dri.* , GROUP_CONCAT(e.episode_number ORDER BY e.episode_number ASC) AS episode_number
// FROM hin_drive a_dri
// JOIN anime_ep a_ep ON a_dri.anime_id = a_ep.anime_id
// WHERE a_ep.episode_number = 1
// GROUP BY a.anime_id;