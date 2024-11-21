const express = require('express');
const AgricultureProduct = require('../../models/product');
const app = express();

app.post('/add-products', async (req, res) => {
  try {
    const product = new AgricultureProduct(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get('/get-products', async (req, res) => {
  try {
    const products = await AgricultureProduct.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await AgricultureProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.patch('/update-products/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'quantity', 'unit', 'price', 'image', 'weight', 'description', 'ingredients', 'type', 'company', 'deliveryCharges', 'url', 'uploadedOn'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const product = await AgricultureProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }

    updates.forEach((update) => product[update] = req.body[update]);
    await product.save();
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.delete('/delete-products/:id', async (req, res) => {
  try {
    const product = await AgricultureProduct.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;