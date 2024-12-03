const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');

async function searchKissanGharProducts(searchString, exact = false) {
    const url = 'https://www.kissanghar.pk/search-products';
    const formData = new URLSearchParams();
    formData.append('category', '0');
    formData.append('search', searchString);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Select the product container
        const productContainer = $('.row.shop_wrapper');

        // Check if there are product elements
        if (productContainer.children().length === 0) {
            return []; // Return empty array if no products found
        }

        // Extract information for each product
        const products = productContainer.find('.col-lg-4.col-md-4.col-sm-6.col-xs-6').map((i, product) => {
            const title = $(product).find('.product_name a').attr('title')?.trim();
            const priceText = $(product).find('.current_price').first().text().replace('Rs.', '').replace(/[^\d.]/g, ''); // Extract numeric price only
            const price = parseFloat(priceText);
            const imageUrl = $(product).find('.product_thumb .primary_img img').attr('src');
            const productUrl = $(product).find('.product_thumb .primary_img').attr('href');

            // If exact matching is required, only include products where the title contains the search string
            if (exact && !title.toLowerCase().includes(searchString.toLowerCase())) {
                return null; // Skip this product if title does not include search string
            }

            return { title, price, imageUrl: `https://www.kissanghar.pk/${imageUrl}`, productUrl: `https://www.kissanghar.pk/${productUrl}` };
        }).get().filter(Boolean); // Remove any null values from the result array

        // console.log(products);  // Output the extracted data or return it
        return products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

module.exports = searchKissanGharProducts;
