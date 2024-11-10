
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');

async function fetchCropData(url, crop) {
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const html = await response.text();
        const $ = cheerio.load(html);
        const data = [];

        // Select each figure with the specified class
        $('figure.wp-block-table.is-style-stripes').each((i, figure) => {
            const provinceInfo = $(figure).find('figcaption').text();
            let provinceName = provinceInfo.split(' in').pop().trim();
            if (provinceName.toLowerCase().includes('pakistan')){
                provinceName = null;
            } else if (!(provinceName.toLowerCase().includes('punjab') || 
                        provinceName.toLowerCase().includes('sindh') ||
                        provinceName.toLowerCase().includes('balochistan') ||
                        provinceName.toLowerCase().includes('kpk')
            )){
                provinceName = null;
            }

            // Iterate over each row in the table body to extract city and price info
            $(figure).find('tbody tr').each((j, row) => {
                const cells = $(row).find('td');
                if (cells.length === 3) {
                    const cityDistrict = $(cells[0]).text().trim();
                    const minPrice = $(cells[1]).text().trim();
                    const maxPrice = $(cells[2]).text().trim();

                     // Skip the row if the first column contains the province name
                    if (provinceName && cityDistrict.toLowerCase().includes(provinceName.toLowerCase())) {
                        return; // Skip this row
                    }

                    // skip the row if the first column contains the any of these sindh, kpk, balochistan, punjab
                    if (cityDistrict.toLowerCase().includes('sindh') ||
                        cityDistrict.toLowerCase().includes('kpk') ||
                        cityDistrict.toLowerCase().includes('balochistan') ||
                        cityDistrict.toLowerCase().includes('punjab')){
                        return;
                    }

                    // Push extracted information to the data array
                    data.push({
                        crop,
                        province: provinceName,
                        cityDistrict,
                        minPrice,
                        maxPrice,
                    });
                }
            });
        });

        console.log(data); // Output the extracted data or process it as needed
        return data;
    } catch (error) {
        console.error('Failed to fetch cotton prices:', error);
        return [];
    }
}


// Function to fetch cotton prices
async function fetchCottonPrices() {
    return await fetchCropData('https://kissanshop.com/cotton-rate-in-pakistan/', 'Cotton');
}

// Function to fetch wheat prices
async function fetchWheatPrices() {
    return await fetchCropData('https://kissanshop.com/wheat-rate-in-pakistan/', 'Wheat');
}

// Function to fetch mustard prices
async function fetchMustardPrices() {
    return await fetchCropData('https://kissanshop.com/mustard-price-in-pakistan/', 'Mustard');
}

// Function to fetch corn prices
async function fetchCornPrices() {
    return await fetchCropData('https://kissanshop.com/corn-price-in-pakistan/', 'Corn');
}

// Function to fetch rice prices
async function fetchRicePrices() {
    return await fetchCropData('https://kissanshop.com/today-rice-price-in-pakistan/', 'Rice');
}

// Export the functions to use in other parts of your application
module.exports = {
    fetchCottonPrices,
    fetchWheatPrices,
    fetchMustardPrices,
    fetchCornPrices,
    fetchRicePrices,
};
