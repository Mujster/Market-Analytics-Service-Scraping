const express = require('express')
const growPakRoute = require('./routes/scrapping/growPakRoute')
const kissanGharRoute = require('./routes/scrapping/kisanGharRoute')
const kisanShopRoute = require('./routes/scrapping/kisanShopRoute')
const zaraeeRoute = require('./routes/scrapping/zaraeeRoute')
const farmGharRoute = require('./routes/scrapping/farmGharRoute')
const amisRoute = require('./routes/scrapping/amisRoute')
const productsRoute = require('./routes/scrapping/productsRoute')

const app = express()
const port = 3000

app.use('/growpak', growPakRoute);
app.use('/kissanghar', kissanGharRoute);
app.use('/kisanshop', kisanShopRoute);
app.use('/zaraee', zaraeeRoute);
app.use('/farmGhar', farmGharRoute);
app.use('/amis', amisRoute);
app.use('/products', productsRoute);


app.get('/', (req, res) => res.send('Scrapping!'))

app.listen(port, () => console.log(`Service Running on ${port}!`));

