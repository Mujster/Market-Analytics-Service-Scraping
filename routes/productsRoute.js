const express = require('express');
const router = express.Router();

const fetchZareeProductData = require('../utils/zaraee');
const searchProducts = require('../utils/growPak');
const searchKissanGharProducts = require('../utils/kissanGhar');

const calculateAnalytics = (products) => {
    const prices = products
        .map(p => parseFloat(p.price.toString().replace(/[^0-9.]/g, '')))
        .filter(price => !isNaN(price));

    const suggestedPrice = prices.length
        ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
        : null;

    // Generate data for line chart: Price trends by source
    const priceTrends = products.map((product, index) => ({
        name: `Product ${index + 1}`,
        price: parseFloat(product.price.toString().replace(/[^0-9.]/g, '')) || 0,
    }));

    // Generate data for pie chart: Product distribution by source
    const sourceDistribution = products.reduce((acc, product) => {
        const source = product.productUrl.includes('zaraee')
            ? 'Zaraee'
            : product.productUrl.includes('growpak')
            ? 'GrowPak'
            : 'KissanGhar';

        acc[source] = (acc[source] || 0) + 1;
        return acc;
    }, {});

    const pieChartData = Object.entries(sourceDistribution).map(([name, value]) => ({ name, value }));

    return {
        totalProducts: products.length,
        suggestedPrice: suggestedPrice ? `Rs.${suggestedPrice}` : 'N/A',
        lineChartData: priceTrends,
        pieChartData: pieChartData,
    };
};

// Route to Get the analytics of the product
// Pass the serachSting e.g. Pesticide
// Returns 
// - Line Chart Data for Other Similar product prices
// - Pie Chart for number of poducts found against a website
// - all Found Products
// - Total Products Count
// - Suggested Price
router.get('/analytics', async (req, res) => {
    const { searchString } = req.query;

    if (!searchString) {
        return res.status(400).json({ error: 'searchString query parameter is required' });
    }

    try {
        const zareeProducts = await fetchZareeProductData(searchString);
        const growPakProducts = await searchProducts(searchString);
        const kissanGharProducts = await searchKissanGharProducts(searchString);

        let allProducts = [...zareeProducts, ...growPakProducts, ...kissanGharProducts];

        // Filter products to only include those whose titles contain the search string (case-insensitive)
        const lowerCaseSearchString = searchString.toLowerCase();
        allProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(lowerCaseSearchString)
        );

        const analytics = calculateAnalytics(allProducts);

        return res.json({
            analytics,
            products: allProducts,
        });

    } catch (error) {
        console.error('Error fetching product data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching product data.' });
    }
});

module.exports = router;
