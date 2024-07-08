const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { curl } = require('../utils/crawler');

dotenv.config();

const SearchAnimeTVCrawler = async (keyword) => {
    try {
        // const data = await curl(`https://9animetv.to/ajax/search/suggest?keyword=${keyword}`);
        // const data = await curl(`https://9animetv.to/search?keyword=${keyword}`);
        const data = await curl(`${process.env.HOST_CRAWL_ANIME_TV}/tim-kiem?keyword=${keyword}`);
        const $ = await cheerio.load(data);
        const animeList = {
            list: [],
            page: []
        };

        $('.MovieList article').each((index, element) => {
            const href = $(element).find('a').attr('href');
            const imageSrc = $(element).find('.Image img').attr('src');
            const filmName = $(element).find('h2.Title').text().trim();
            const episode = $(element).find('span.mli-eps i').text().trim();
            const views = $(element).find('span.Year').text().trim();

            animeList.list.push({
                href,
                imageSrc,
                filmName,
                episode,
                views
            });
        });

        return animeList;
    } catch (error) {
        console.log(error)
    }
}

module.exports = SearchAnimeTVCrawler;