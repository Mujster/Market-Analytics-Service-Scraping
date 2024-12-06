require('dotenv').config();
const express = require('express');
const growPakRoute = require('./routes/scrapping/growPakRoute');
const kissanGharRoute = require('./routes/scrapping/kisanGharRoute');
const kisanShopRoute = require('./routes/scrapping/kisanShopRoute');
const zaraeeRoute = require('./routes/scrapping/zaraeeRoute');
const farmGharRoute = require('./routes/scrapping/farmGharRoute');
const amisRoute = require('./routes/scrapping/amisRoute');
const productsRoute = require('./routes/scrapping/productsRoute');

const liveStockRoute = require('./routes/livestock/utility');
//const predictionRoute = require('./routes/prediction/regression');
const priceListRoute = require('./routes/pricelist/utility');
const productRoute=require('./routes/product/utility');

const app = express();
const port = process.env.PORT || '';
const cors = require('cors');
app.use(cors());

//utility routes
app.use('/livestock', liveStockRoute);
//app.use('/prediction', predictionRoute);
app.use('/pricelist', priceListRoute);
app.use('/product', productRoute);

//scrapping routes
app.use('/growpak', growPakRoute);
app.use('/kissanghar', kissanGharRoute);
app.use('/kisanshop', kisanShopRoute);
app.use('/zaraee', zaraeeRoute);
app.use('/farmGhar', farmGharRoute);
app.use('/amis', amisRoute);
app.use('/products', productsRoute);


app.get('/', (req, res) => res.send('Market Analytics Service Running!'));

app.listen(port, () => console.log(`Market Analytics Service Running On ${port}!`));

