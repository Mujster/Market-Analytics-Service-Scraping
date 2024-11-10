const express = require('express');
const fetchCommodityPrices = require('../utils/amis'); 

const router = express.Router();

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

module.exports = router;
