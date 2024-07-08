const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { curl } = require('../utils/crawler');
const { animeDetailDB } = require('../middlewares/animeDB');
const path = require('path');
const { downloadImage } = require('../utils');

dotenv.config();


const AnimeTVDetailCrawler = async (url) => {
    try {
        const data = await curl(`${process.env.HOST_CRAWL_ANIME_TV}${url}`);
        const $ = await cheerio.load(data);
        const animeDetailPromises = [];

        $('.TpRwCont').each((index, element) => {
            animeDetailPromises.push((async () => {
                const title = $(element).find('header h1.Title').text().trim();
                const alias = $(element).find('header h2.SubTitle').text().trim();
                const description = $(element).find('header .Description').text().trim();
                const urlImage = $(element).find('header .Image img').attr('src');
                const poster = path.basename(urlImage);
                await downloadImage(urlImage, poster);
                const watchButton = $(element).find('header .Image a.watch_button_more');
                const paramHref = watchButton.length > 0 ? watchButton.attr('href').split('/')[2] : '';

                const meta = {};
                $(element).find('.MovieInfo.Single .MvTbCn.on.anmt .InfoList li').each((i, metaItem) => {
                    const key = $(metaItem).find('strong').text().trim().replace(':', '');
                    let value = $(metaItem).clone().children().remove().end().text().trim();
                    if (key === 'Thể loại') {
                        value = $(metaItem).find('a').map((j, category) => $(category).text().trim()).get().join(', ');
                    }
                    if (key === 'Chất lượng' || key === 'Rating') {
                        value = $(metaItem).find('span').text().trim();
                    }
                    if (key === 'Điểm') {
                        value = $(metaItem).text().trim().replace('||', '|');
                    }

                    meta[key] = value;
                });

                return {
                    poster,
                    title,
                    alias,
                    description,
                    paramHref,
                    meta,
                };
            })());
        });
        const animeDetail = await Promise.all(animeDetailPromises);

        await animeDetailDB(animeDetail);
        return animeDetail;
    } catch (error) {
        console.log(error);
    }
};

module.exports = AnimeTVDetailCrawler;