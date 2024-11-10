const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

const fetchZareeProductData = async (searchString) => {
    const url = `https://zaraee.pk/search?keyword=${searchString}`;
    
    try {
        // Send request to the search URL
        const response = await fetch(url);
        
        // Check if the response is okay
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        // Parse the HTML response
        const html = await response.text();
        const $ = cheerio.load(html);

        // Select the row containing the product listings
        const productRow = $('div.row.gutters-5.row-cols-xxl-4.row-cols-xl-3.row-cols-lg-4.row-cols-md-3.row-cols-2');

        // Check if there are any products in the row
        if (productRow.children().length === 0) {
            return [];
        }

        // Extract product details
        const products = [];
        productRow.find('.col').each((i, product) => {
            const productUrl = $(product).find('a.d-block').attr('href');
            const title = $(product).find('h3.fs-13').text().trim();
            const price = $(product).find('span.fw-700.text-primary').text().trim();
            const imageUrl = $(product).find('img.img-fit').attr('src');
            
            products.push({
                title,
                price,
                imageUrl,
                productUrl,
            });
        });

        return products;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        return [];
    }
};


module.exports = fetchZareeProductData;
