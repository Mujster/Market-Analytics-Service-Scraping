const express = require('express');
const { fetchCommodityPrices, calculateAverage, groupData} = require('../utils/amis'); 
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Route implementation
router.get('/commodity/analytics', async (req, res) => {
    const { startDate, endDate, commodityId, city } = req.query;

    if (!commodityId || !startDate || !endDate) {
        return res.status(400).json({ error: 'CommodityId, startDate, and endDate are required.' });
    }

    const filePath = path.join(__dirname, '../data', `commodity_${commodityId}.json`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: `Data for commodityId ${commodityId} not found.` });
    }

    try {
        // Parse the data file
        const commodityData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const filteredData = commodityData.data.filter(
            (record) => new Date(record.date) >= new Date(startDate) && new Date(record.date) <= new Date(endDate)
        );

        if (!filteredData.length) {
            return res.status(404).json({ error: 'No data found for the given date range.' });
        }

        // Determine grouping (daily, weekly, monthly)
        const dateDifference = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        const groupBy = dateDifference > 180 ? 'month' : dateDifference > 7 ? 'week' : 'day';

        // Process data
        const groupedData = groupData(filteredData, startDate, endDate, groupBy);
        const lineData = [];

        Object.keys(groupedData).forEach((group) => {
            const prices = groupedData[group].map((entry) =>
                entry.prices
                    .filter((price) => (city ? price.city === city : price.min !== null && price.max !== null))
                    .map((price) => ({
                        min: price.min,
                        max: price.max,
                        fqp: price.fqp,
                    }))
            );

            // Flatten the prices array
            const flatPrices = prices.flat();

            if (flatPrices.length) {
                const minValues = flatPrices.map((p) => p.min).filter((v) => v !== null);
                const maxValues = flatPrices.map((p) => p.max).filter((v) => v !== null);
                const fqpValues = flatPrices.map((p) => p.fqp).filter((v) => v !== null);

                lineData.push({
                    name: group,
                    min: calculateAverage(minValues) || null,
                    max: calculateAverage(maxValues) || null,
                    price: calculateAverage(fqpValues) || null,
                });
            }
        });

        res.json(lineData);
    } catch (error) {
        console.error('Error processing analytics:', error);
        res.status(500).json({ error: 'Failed to process analytics.' });
    }
});


router.get('/commodity/price', async (req, res) => {
    const { commodityId } = req.query;
    const { date } = req.query;
    
    if (!commodityId) {
        return res.status(400).json({ error: 'Commodity Id is required' });
    }
    
    try {
        const prices = await fetchCommodityPrices(commodityId, date);
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search commodity prices' });
    }
});


router.get('/commodities/names/list', (req, res) => {
    const filePath = path.join(__dirname, '../data', 'commodities.json');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Commodities file not found' });
    }

    try {
        // Read and parse the JSON file
        const commoditiesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Send the data in the response
        res.json(commoditiesData);
    } catch (error) {
        console.error('Error reading commodities file:', error);
        res.status(500).json({ error: 'Failed to load commodities list' });
    }
});




module.exports = router;
