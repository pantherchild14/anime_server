const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { curl } = require('../utils/crawler');
const { animeDetailDB } = require('../middlewares/animeDB');

dotenv.config();

const AnimeDetailCrawler = async (url) => {
    try {
        const data = await curl(`https://9animetv.to${url}`);
        const $ = await cheerio.load(data);
        const animeDetail = [];

        $('.block_area-detail .anime-detail').each((index, element) => {
            const poster = $(element).find('.anime-poster .film-poster img.film-poster-img').attr('src');
            const fileName = path.basename(poster);
            console.log('fileName: ', fileName);
            $(element).find('.film-infor').each((i, elementInfor) => {
                const title = $(elementInfor).find('.film-infor-top h2.film-name').text().trim();
                const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                const alias = $(elementInfor).find('.film-infor-top .alias').text().trim();
                const description = $(elementInfor).find('.film-description p.shorting').text().trim();

                const meta = {};
                $(elementInfor).find('.meta .col1 .item, .meta .col2 .item').each((j, metaItem) => {
                    const itemTitle = $(metaItem).find('.item-title').text().trim().slice(0, -1);
                    let itemContent;
                    if ($(metaItem).find('.item-content a').length > 0) {
                        itemContent = $(metaItem).find('.item-content a').map((k, link) => $(link).text().trim()).get().join(', ');
                    } else {
                        itemContent = $(metaItem).find('.item-content').text().trim();
                    }
                    meta[itemTitle] = itemContent;
                });

                animeDetail.push({
                    poster,
                    title,
                    alias,
                    description,
                    meta,
                    paramHref: slugify(title),
                });
            });
        });
        await animeDetailDB(animeDetail);
        return animeDetail;
    } catch (error) {
        console.log(error)
    }
}

module.exports = AnimeDetailCrawler;