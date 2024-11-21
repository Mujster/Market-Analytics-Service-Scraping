const express = require('express');
const app = express();
const LiveStock = require('../../models/livestock');


app.post('/add-livestock', async (req, res) => {
  try {
    const liveStock = new LiveStock(req.body);
    await liveStock.save();
    res.status(201).send(liveStock);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get('/get-livestock', async (req, res) => {
  try {
    const liveStock = await LiveStock.find({});
    res.status(200).send(liveStock);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get('/livestock/:id', async (req, res) => {
  try {
    const liveStock = await LiveStock.findById(req.params.id);
    if (!liveStock) {
      return res.status(404).send();
    }
    res.status(200).send(liveStock);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.patch('/livestock/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['age', 'animal', 'location', 'updateDate', 'name', 'category', 'description', 'media', 'minLiveWeight', 'maxLiveWeight', 'breed', 'quantity', 'url', 'gender', 'pregnant', 'teethCount'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const liveStock = await LiveStock.findById(req.params.id);
    if (!liveStock) {
      return res.status(404).send();
    }

    updates.forEach((update) => liveStock[update] = req.body[update]);
    await liveStock.save();
    res.status(200).send(liveStock);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/livestock/:id', async (req, res) => {
  try {
    const liveStock = await LiveStock.findByIdAndDelete(req.params.id);
    if (!liveStock) {
      return res.status(404).send();
    }
    res.status(200).send(liveStock);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;