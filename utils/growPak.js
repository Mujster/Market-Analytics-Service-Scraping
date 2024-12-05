const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

async function searchProducts(searchString) {
    const formattedSearchString = searchString.replace(/\s+/g, '+');
    const url = `https://growpak.store/?product_cat=0&s=${formattedSearchString}&post_type=product`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Load HTML with cheerio
        const $ = cheerio.load(html);
        
        // Select the product elements by ID and class name
        const productElements = $('#mf-shop-content .products .product');
        
        // Extract information for each product
        const products = productElements.map((i, product) => {
            const title = $(product).find('.woo-loop-product__title a').text().trim();
            // const price = $(product).find('.price bdi').text().trim();

            const priceText = $(product).find('.price bdi').first().text().trim();
            const numericPrice =  parseFloat(priceText.replace(/[^\d.]/g, ''));

            const productUrl = $(product).find('.woo-loop-product__title a').attr('href');
            const imageUrl = $(product).find('.mf-product-thumbnail img').attr('src');
            const soldBy = $(product).find('.sold-by-meta a').text().trim();
            
            return { title, price: numericPrice, productUrl, imageUrl, soldBy };
        }).get(); // Use .get() to convert to an array
        
        // console.log(products);  // Output extracted data or return it
        return products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

module.exports = searchProducts;
