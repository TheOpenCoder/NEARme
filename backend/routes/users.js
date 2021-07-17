const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const { Storage } = require('@google-cloud/storage');
const gc = new Storage({
  keyFilename: path.join(__dirname, '../near-me-backend-dca4581445ec.json'),
  projectId: 'near-me-backend',
});
const { v4: uuidv4 } = require('uuid');
const bucket = gc.bucket(process.env.GCS_BUCKET);

router.post('/', upload.single('image'), async (req, res) => {
  // Requires Email, Name, Password, Location
  try {
    // console.log(req.file);
    let {
      name,
      email,
      password,
      lat,
      long,
      location_name,
      address,
      country_code,
    } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (emailQuery.rowCount > 0) {
      return res.status(400).send('Email ID already exists');
    }
    password = await bcrypt.hash(password, 10);
    const newFilename = uuidv4() + '-' + req.file.originalname;
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream();
    blobStream.on('error', (err) => {
      console.log(err);
    });
    blobStream.on('finish', async () => {
      const image = 'https://storage.googleapis.com/near-me-files/' + blob.name;
      let newUser = await pool.query(
        'INSERT INTO users(name, email, pass, lat, long, location_name, address, country_code, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [
          name,
          email,
          password,
          lat,
          long,
          location_name,
          address,
          country_code,
          image,
        ]
      );
      return res.status(201).send(newUser.rows[0]);
    });
    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/kyc', async (req, res) => {
  try {
    const { kyc_verified } = req.body;
    const { id } = req.params;
    const updatedUser = await pool.query(
      'UPDATE users SET kyc_verified = $1 WHERE id = $2 RETURNING *',
      [kyc_verified, id]
    );
    return res.status(200).send(updatedUser.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/creds', async (req, res) => {
  try {
    const { customer_id, wallet_id } = req.body;
    const { id } = req.params;
    const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    if (userQuery.rowCount <= 0)
      return res.status(400).send('No such email exists');
    const updatedUser = await pool.query(
      'UPDATE users SET customer_id = $1, wallet_id = $2 WHERE id = $3 RETURNING *',
      [customer_id, wallet_id, id]
    );
    return res.status(200).send(updatedUser.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // Requires Email and Password
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );
    if (emailQuery.rowCount <= 0)
      return res.status(400).send('Email or password incorrect');
    const passQuery = await pool.query(
      'SELECT pass FROM users WHERE email = $1',
      [email]
    );
    const passMatched = await bcrypt.compare(password, passQuery.rows[0].pass);
    // console.log(passMatched);
    if (!passMatched)
      return res.status(400).send('Email or password incorrect');
    else {
      const user = await pool.query(
        'SELECT * FROM users WHERE users.email = $1',
        [email]
      );
      return res.status(200).send(user.rows[0]);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.post('/:id/wishlist', async (req, res) => {
  // Get Product Id
  try {
    const { product_id } = req.body;
    const { id } = req.params;
    const productQuery = await pool.query(
      'SELECT * FROM users_wishlist WHERE product_id = $1 AND user_id = $2',
      [product_id, id]
    );
    if (productQuery.rowCount > 0)
      return res.status(400).send('Product already present in wishlist');
    const newProduct = await pool.query(
      'INSERT INTO users_wishlist(user_id, product_id) VALUES($1, $2) RETURNING *',
      [id, product_id]
    );
    return res.status(200).send(newProduct.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id/wishlist', async (req, res) => {
  try {
    const { id } = req.params;
    const products = await pool.query(
      'SELECT p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price, p.seller_id, s.name AS seller_name FROM users_wishlist uw JOIN products p ON uw.product_id = p.id JOIN sellers s ON p.seller_id = s.id WHERE uw.user_id = $1',
      [id]
    );
    return res.status(200).send(products.rows);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.delete('/:id/wishlist', async (req, res) => {
  try {
    const { product_id } = req.body;
    const { id } = req.params;
    const deletedProduct = await pool.query(
      'DELETE FROM users_wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [id, product_id]
    );
    if (deletedProduct.rowCount > 0)
      return res.status(200).send(deletedProduct.rows[0]);
    else return res.status(404).send('Not Present');
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.post('/:id/bag', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const { id } = req.params;
    const productQuery = await pool.query(
      'SELECT * FROM users_bag WHERE product_id = $1 AND user_id = $2',
      [product_id, id]
    );
    if (productQuery.rowCount > 0) {
      const updatedProduct = await pool.query(
        'UPDATE users_bag SET quantity = $1 WHERE product_id = $2 AND user_id = $3 RETURNING *',
        [quantity, product_id, id]
      );
      return res.status(200).send(updatedProduct.rows[0]);
    }
    const newProduct = await pool.query(
      'INSERT INTO users_bag(user_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *',
      [id, product_id, quantity]
    );
    return res.status(200).send(newProduct.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id/bag', async (req, res) => {
  try {
    const { id } = req.params;
    const products = await pool.query(
      'SELECT p.id AS product_id, p.name AS product_name, ub.quantity, p.image AS product_image, p.price, p.seller_id, s.name AS seller_name FROM users_bag ub JOIN products p ON ub.product_id = p.id JOIN sellers s ON p.seller_id = s.id WHERE ub.user_id = $1',
      [id]
    );
    return res.status(200).send(products.rows);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.delete('/:id/bag', async (req, res) => {
  try {
    const { product_id } = req.body;
    const { id } = req.params;
    const deletedProduct = await pool.query(
      'DELETE FROM users_bag WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [id, product_id]
    );
    if (deletedProduct.rowCount > 0)
      return res.status(200).send(deletedProduct.rows[0]);
    else return res.status(404).send('Not Present');
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/lendlimit', async (req, res) => {
  try {
    const { lend_limit } = req.body;
    const { id } = req.params;
    const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    if (userQuery.rowCount <= 0)
      return res.status(400).send('User not present');
    const updatedUser = await pool.query(
      'UPDATE users SET lend_limit = $1 WHERE id = $2 RETURNING *',
      [lend_limit, id]
    );
    return res.status(200).send(updatedUser.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.post('/:id/orders', async (req, res) => {
  try {
    const { seller_id, order_price, products } = req.body;
    const { id } = req.params;
    const newOrder = await pool.query(
      'INSERT INTO orders(user_id, seller_id, order_price, order_status, delivery_price) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [id, seller_id, order_price, 'ordered', (2 * parseInt(order_price)) / 100]
    );
    const newProducts = [];
    for (let i = 0; i < products.length; i++) {
      const order_id = newOrder.rows[0].id;
      const { product_id, quantity } = products[i];
      const newOrderProduct = await pool.query(
        'INSERT INTO order_products(order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *',
        [order_id, product_id, quantity]
      );
      newProducts[i] = newOrderProduct.rows[0];
    }
    newOrder.rows[0].products = newProducts;
    return res.status(200).send(newOrder.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
