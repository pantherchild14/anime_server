const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { curl } = require('../utils/crawler');

dotenv.config();

const PlayerCrawler = async (paramHref, episodeNumber) => {
    try {
        const data = await curl(`${process.env.HOST_CRAWL_ANIME_TV}/xem-phim/${paramHref}/${episodeNumber}`);
        const $ = cheerio.load(data);
        const anime = [];
        const videoURLs = [];
        $('script').each((index, element) => {
            const scriptContent = $(element).html().trim();
            if (scriptContent.includes('var HLS')) {
                // const regex = /var HLS = "(.*?)";\s*var EMB = "(.*?)";\s*var LOT = "(.*?)";\s*var HYDRAX = "(.*?)";\s*var VPRO = "(.*?)";\s*var TIK = "(.*?)";\s*var AHS = "(.*?)";/;
                const regex = /var HYDRAX = "(.*?)";\s*var VPRO = "(.*?)";\s*var AHS = "(.*?)";\s*var TIK = "(.*?)";/;
                const match = scriptContent.match(regex);
                if (match) {
                    const [_, HYDRAX, VPRO, AHS, TIK] = match;

                    const animeDetail = [
                        { type: 'HYDRAX', value: HYDRAX || null },
                        { type: 'VPRO', value: VPRO || null },
                        { type: 'TIK', value: TIK || null },
                        { type: 'AHS', value: AHS || null }
                    ];
                    anime.push(animeDetail);
                }
            }
        });

        let hasVideoURLs = false;
        $('input[name="src_an0"]').each((index, element) => {
            const value = $(element).val();
            try {
                const json = JSON.parse(value.replace(/&quot;/g, '"'));
                if (json.file) {
                    videoURLs.push(json.file);
                    hasVideoURLs = true;
                }
            } catch (e) { }
        });

        if (!hasVideoURLs) {
            videoURLs.push(null);
        }

        return { anime, videoURLs };

    } catch (error) {
        console.log(error);
    }
};

module.exports = PlayerCrawler;
