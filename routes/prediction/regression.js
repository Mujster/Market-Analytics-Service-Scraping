const express = require("express");
import Crops from "../models/Crops.js";
const router = express.Router();


// Function to calculate simple linear regression for price prediction
const linearRegression = (xValues, yValues) => {
  const n = xValues.length;

  const sumX = xValues.reduce((acc, x) => acc + x, 0);
  const sumY = yValues.reduce((acc, y) => acc + y, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

  // Calculate the slope (m) and intercept (b)
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return { m, b };
};

// General market analytics endpoint (for all crops)
router.get('/market/analytics', async (req, res) => {
  try {
    // Fetch all crops prices
    const crops = await Crops.find().select('currentPrice -_id');
    
    if (crops.length === 0) {
      return res.status(404).json({ message: 'No crops found' });
    }

    // Extract price values into an array
    const priceValues = crops.map(crop => crop.currentPrice);
    
    // Calculate minimum, maximum, and average
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const avgPrice = priceValues.reduce((acc, price) => acc + price, 0) / priceValues.length;
    
    // Calculate median
    priceValues.sort((a, b) => a - b);
    let medianPrice;
    if (priceValues.length % 2 === 0) {
      medianPrice = (priceValues[priceValues.length / 2 - 1] + priceValues[priceValues.length / 2]) / 2;
    } else {
      medianPrice = priceValues[Math.floor(priceValues.length / 2)];
    }

    res.json({
      minPrice,
      maxPrice,
      avgPrice,
      medianPrice
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Specific crop analytics endpoint (for one crop by name)
router.get('/:name/analytics', async (req, res) => {
  const cropName = req.params.name;

  try {
    // Find the specific crop by name
    const crop = await Crops.findOne({ name: cropName });

    if (!crop) {
      return res.status(404).json({ message: `Crop with name ${cropName} not found` });
    }

    // Fetch all price history for the specific crop
    const priceHistory = crop.priceHistory;

    if (priceHistory.length === 0) {
      return res.json({
        name: cropName,
        currentPrice: crop.currentPrice,
        priceHistory: 'No price history available',
        minPrice: 'N/A',
        maxPrice: 'N/A',
        avgPrice: 'N/A',
        medianPrice: 'N/A'
      });
    }

    // Calculate min, max, average, and median for price history
    const priceValues = priceHistory.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const avgPrice = priceValues.reduce((acc, price) => acc + price, 0) / priceValues.length;

    priceValues.sort((a, b) => a - b);
    let medianPrice;
    if (priceValues.length % 2 === 0) {
      medianPrice = (priceValues[priceValues.length / 2 - 1] + priceValues[priceValues.length / 2]) / 2;
    } else {
      medianPrice = priceValues[Math.floor(priceValues.length / 2)];
    }

    // Prepare for prediction (using linear regression)
    const datesInMs = priceHistory.map(p => new Date(p.date).getTime()); // Convert dates to milliseconds
    const predictedPrice = linearRegression(datesInMs, priceValues);
    const nextDate = new Date(Math.max(...datesInMs) + 30 * 24 * 60 * 60 * 1000); // Next month prediction

    // Predict next price
    const nextPrice = predictedPrice.m * nextDate.getTime() + predictedPrice.b;

    // Respond with the detailed analytics for the specific crop and predicted price
    res.json({
      name: cropName,
      currentPrice: crop.currentPrice,
      priceHistory,
      minPrice,
      maxPrice,
      avgPrice,
      medianPrice,
      predictedPrice: nextPrice,
      predictedDate: nextDate.toISOString()
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Crop price prediction endpoint (for one crop by name)
router.get('/predict/:name', async (req, res) => {
  const cropName = req.params.name;

  try {
    const crop = await Crops.findOne({ name: cropName });
    if (!crop) {
      return res.status(404).json({ message: `Crop with name ${cropName} not found` });
    }
    const priceHistory = crop.priceHistory;

    if (priceHistory.length < 2) {
      return res.status(400).json({ message: 'Not enough price history to make a prediction' });
    }
    const datesInMs = priceHistory.map(p => new Date(p.date).getTime()); // Convert dates to milliseconds
    const priceValues = priceHistory.map(p => p.price); // Get price values

    const predictedPrice = linearRegression(datesInMs, priceValues);
    const nextDate = new Date(Math.max(...datesInMs) + 30 * 24 * 60 * 60 * 1000); // Next month prediction

    // Predict next price
    const nextPrice = predictedPrice.m * nextDate.getTime() + predictedPrice.b;

    res.json({
      name: cropName,
      currentPrice: crop.currentPrice,
      predictedPrice: nextPrice,
      predictedDate: nextDate.toISOString()
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
