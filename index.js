const express = require('express')
const growPakRoute = require('./routes/growPakRoute')
const kissanGharRoute = require('./routes/kisanGharRoute')
const kisanShopRoute = require('./routes/kisanShopRoute')
const zaraeeRoute = require('./routes/zaraeeRoute')
const farmGharRoute = require('./routes/farmGharRoute')
const amisRoute = require('./routes/amisRoute')

const app = express()
const port = 3000

app.use('/growpak', growPakRoute);
app.use('/kissanghar', kissanGharRoute);
app.use('/kisanshop', kisanShopRoute);
app.use('/zaraee', zaraeeRoute);
app.use('/farmGhar', farmGharRoute);
app.use('/amis', amisRoute);

app.get('/', (req, res) => res.send('Scrapping!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))