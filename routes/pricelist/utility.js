const express = require('express');
const PriceList= require('../../models/priceList');
const app = express();


// Create a new price list item
app.post('/add-pricelist', async (req, res) => {
  try {
    const priceListItem = new PriceList(req.body);
    await priceListItem.save();
    res.status(201).send(priceListItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all price list items
app.get('/get-pricelist', async (req, res) => {
  try {
    const priceListItems = await PriceList.find();
    res.status(200).send(priceListItems);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single price list item by ID
app.get('/pricelist/:id', async (req, res) => {
  try {
    const priceListItem = await PriceList.findById(req.params.id);
    if (!priceListItem) {
      return res.status(404).send();
    }
    res.status(200).send(priceListItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a price list item by ID
app.patch('/pricelist/:id', async (req, res) => {
  try {
    const priceListItem = await PriceList.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!priceListItem) {
      return res.status(404).send();
    }
    res.status(200).send(priceListItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a price list item by ID
app.delete('/pricelist/:id', async (req, res) => {
  try {
    const priceListItem = await PriceList.findByIdAndDelete(req.params.id);
    if (!priceListItem) {
      return res.status(404).send();
    }
    res.status(200).send(priceListItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;