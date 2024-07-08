const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { curl } = require('../utils/crawler');

dotenv.config();

const SearchAnimeCrawler = async (keyword) => {
    try {
        // const data = await curl(`https://9animetv.to/ajax/search/suggest?keyword=${keyword}`);
        const data = await curl(`https://9animetv.to/search?keyword=${keyword}`);
        const $ = await cheerio.load(data);
        const animeList = {
            list: [],
            page: []
        };

        $('.block_area.block_area-anime .flw-item.item-qtip').each((index, element) => {
            const href = $(element).find('.film-detail h3.film-name .dynamic-name').attr('href');
            const imageSrc = $(element).find('.film-poster img.film-poster-img').attr('data-src');
            const filmName = $(element).find('.film-detail h3.film-name').text().trim();

            animeList.list.push({
                href,
                imageSrc,
                filmName
            });
        });
        const pagination = $('.anime-pagination').find('.btn.btn-sm.btn-blank').text().trim();
        const pageNum = pagination.split(' ')[1];
        animeList.page.push(pageNum);
        return animeList;
    } catch (error) {
        console.log(error)
    }
}

module.exports = SearchAnimeCrawler;