const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

exports.HandleMp4Anime = async (fileUrl) => {
    try {
        const response = await axios.head(fileUrl);
        const { headers } = response;

        const uuid = uuidv4();
        const fileName = path.basename(fileUrl);
        const fileSize = headers['content-length'];
        let mimeType = headers['content-type'];

        if (mimeType.includes(';')) {
            mimeType = mimeType.split(';')[0];
        }
        const fileDetails = {
            uuid: uuid,
            name: fileName,
            size: fileSize,
            // link: fileUrl.split('/'),
            link: fileName.split('.')[0],
            link_mp4: fileUrl,
            mime_type: mimeType.split('/')[1],
        };

        return fileDetails;

    } catch (error) {
        console.error('Error fetching file details:', error);
        return null;
    }
};