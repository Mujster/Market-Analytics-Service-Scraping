const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors());

const LivestockRoutes=require('./routes/livestock/utility');
const ProductRoutes=require('./routes/product/utility');
const PriceListRoutes=require('./routes/priceList/utility');

// mongoose.connect('mongodb://localhost:27017/marketprice', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => res.send('Market Price Analytics Service !'));

app.use('/livestock', LivestockRoutes);
app.use('/product', ProductRoutes);
app.use('/pricelist', PriceListRoutes);

app.listen(port, () => console.log(`Service Running on ${port}!`));

