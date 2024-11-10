const express = require('express');
const fetchAllFarmGharListings = require('../utils/farmGhar'); 

const router = express.Router();

router.get('/listings', async (req, res) => {
    const { searchString } = req.query;  
    
    if (!searchString) {
        return res.status(400).json({ error: 'Search string is required' });
    }
    
    try {
        const listings = await fetchAllFarmGharListings(searchString);
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search listings' });
    }
});

module.exports = router;
