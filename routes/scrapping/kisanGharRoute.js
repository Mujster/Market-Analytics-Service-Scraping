const express = require('express');
const searchKissanGharProducts = require('../../utils/kissanGhar'); 

const router = express.Router();

router.get('/products', async (req, res) => {
    const { searchString } = req.query;  
    
    if (!searchString) {
        return res.status(400).json({ error: 'Search string is required' });
    }
    
    try {
        const products = await searchKissanGharProducts(searchString);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

module.exports = router;
