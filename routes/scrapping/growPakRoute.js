const express = require('express');
const searchProducts = require('../../utils/growPak'); 

const router = express.Router();

router.get('/products', async (req, res) => {
    const { searchString } = req.query;  // Assume the search term comes from query parameters
    
    if (!searchString) {
        return res.status(400).json({ error: 'Search string is required' });
    }
    
    try {
        const products = await searchProducts(searchString);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

module.exports = router;
