const express = require('express');
const app = express();
const users = require('./routes/users');
const sellers = require('./routes/sellers');
const products = require('./routes/products');
const partners = require('./routes/partners');
const ads = require('./routes/ads');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/v1/users', users);
app.use('/api/v1/sellers', sellers);
app.use('/api/v1/products', products);
app.use('/api/v1/partners', partners);
app.use('/api/v1/ads', ads);
app.get('/', (req, res) => {
  return res.status(200).send('Working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
