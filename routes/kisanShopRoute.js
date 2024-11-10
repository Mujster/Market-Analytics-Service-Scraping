const express = require('express');
const router = express.Router();
const { 
    fetchCottonPrices, 
    fetchWheatPrices, 
    fetchMustardPrices, 
    fetchCornPrices, 
    fetchRicePrices 
} = require('../utils/kisanShop'); 

// Route to get the data of a specific crop (e.g., /crop/wheat)
router.get('/crop/cotton', async (req, res) => {
    try {
        const data = await fetchCottonPrices();
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for Cotton." });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching cotton data:', error);
        res.status(500).json({ message: 'Failed to fetch cotton data.' });
    }
});

router.get('/crop/wheat', async (req, res) => {
    try {
        const data = await fetchWheatPrices();
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for Wheat." });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching wheat data:', error);
        res.status(500).json({ message: 'Failed to fetch wheat data.' });
    }
});

router.get('/crop/mustard', async (req, res) => {
    try {
        const data = await fetchMustardPrices();
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for Mustard." });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching mustard data:', error);
        res.status(500).json({ message: 'Failed to fetch mustard data.' });
    }
});

router.get('/crop/corn', async (req, res) => {
    try {
        const data = await fetchCornPrices();
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for Corn." });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching corn data:', error);
        res.status(500).json({ message: 'Failed to fetch corn data.' });
    }
});

router.get('/crop/rice', async (req, res) => {
    try {
        const data = await fetchRicePrices();
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for Rice." });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching rice data:', error);
        res.status(500).json({ message: 'Failed to fetch rice data.' });
    }
});

// Route to get data for all crops
router.get('/crops', async (req, res) => {
    try {
        const cotton = await fetchCottonPrices();
        const wheat = await fetchWheatPrices();
        const mustard = await fetchMustardPrices();
        const corn = await fetchCornPrices();
        const rice = await fetchRicePrices();

        const allCropsData = {
            cotton,
            wheat,
            mustard,
            corn,
            rice
        };

        // Check if all crop data exists
        if (!cotton.length && !wheat.length && !mustard.length && !corn.length && !rice.length) {
            return res.status(404).json({ message: "No crop data available." });
        }

        res.json(allCropsData);
    } catch (error) {
        console.error('Error fetching crop data:', error);
        res.status(500).json({ message: 'Failed to fetch crop data.' });
    }
});

module.exports = router;
