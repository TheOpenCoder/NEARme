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
const e = require('express');
const { RSA_NO_PADDING } = require('constants');
const gc = new Storage({
  keyFilename: path.join(__dirname, '../near-me-backend-dca4581445ec.json'),
  projectId: 'near-me-backend',
});
const { v4: uuidv4 } = require('uuid');
const bucket = gc.bucket(process.env.GCS_BUCKET);

router.post('/', upload.single('image'), async (req, res) => {
  // Email, Name, Password, Lat, Long, [Categories]
  try {
    let {
      name,
      email,
      password,
      category,
      lat,
      long,
      location_name,
      address,
      country_code,
      open_time,
      close_time,
    } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM sellers WHERE email = $1',
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
        'INSERT INTO sellers(name, email, pass, category, lat, long, location_name, address, country_code, open_time, close_time, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [
          name,
          email,
          password,
          category,
          lat,
          long,
          location_name,
          address,
          country_code,
          open_time,
          close_time,
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

router.put('/:id/creds', async (req, res) => {
  try {
    const { customer_id, wallet_id } = req.body;
    const { id } = req.params;
    const sellerQuery = await pool.query(
      'SELECT * FROM sellers WHERE id = $1',
      [id]
    );
    if (sellerQuery.rowCount <= 0)
      return res.status(400).send('No such email exists');
    const updatedSeller = await pool.query(
      'UPDATE sellers SET customer_id = $1, wallet_id = $2 WHERE id = $3 RETURNING *',
      [customer_id, wallet_id, id]
    );
    return res.status(200).send(updatedSeller.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // Email, Password
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM sellers WHERE email = $1',
      [email]
    );
    if (emailQuery.rowCount == 0)
      return res.status(400).send('Email or password incorrect');
    const passQuery = await pool.query(
      'SELECT pass FROM sellers WHERE email = $1',
      [email]
    );
    const passMatched = await bcrypt.compare(password, passQuery.rows[0].pass);
    // console.log(passMatched);
    if (!passMatched)
      return res.status(400).send('Email or password incorrect');
    else {
      const seller = await pool.query(
        'SELECT * FROM sellers WHERE email = $1',
        [email]
      );
      return res.status(200).send(seller.rows[0]);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/kyc', async (req, res) => {
  try {
    const { kyc_verified } = req.body;
    const { id } = req.params;
    const updatedSeller = await pool.query(
      'UPDATE sellers SET kyc_verified = $1 WHERE id = $2 RETURNING *',
      [kyc_verified, id]
    );
    return res.status(200).send(updatedSeller.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id/products', async (req, res) => {
  // Get all products from a seller
  try {
    const { id } = req.params;
    if (req.query.limit) {
      const { limit } = req.query;
      const products = await pool.query(
        'SELECT s.id AS seller_id, s.name AS seller_name, p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price FROM sellers s JOIN products p ON s.id = p.seller_id WHERE s.id = $1 LIMIT $2',
        [id, limit]
      );
      return res.status(200).send(products.rows);
    } else {
      const products = await pool.query(
        'SELECT s.id AS seller_id, s.name AS seller_name, p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price FROM sellers s JOIN products p ON s.id = p.seller_id WHERE s.id = $1',
        [id]
      );
      return res.status(200).send(products.rows);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id', async (req, res) => {
  // return Name, Id, Open, Close and Rating
  try {
    const { id } = req.params;
    const seller = await pool.query(
      'SELECT id, name, category, lat, long, location_name, rating, people_rated, open_time, close_time, image FROM sellers WHERE id = $1',
      [id]
    );
    return res.status(200).send(seller.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/', async (req, res) => {
  // Get all the shops of a particular category
  try {
    const { category } = req.query;
    const sellers = await pool.query(
      'SELECT id, name, category, rating, people_rated, lat, long, location_name, open_time, close_time, image FROM sellers WHERE LOWER(category) = LOWER($1)',
      [category]
    );
    return res.status(200).send(sellers.rows);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/rating', async (req, res) => {
  try {
    const { user_id, rating } = req.body;
    const { id } = req.params;
    const ratingQuery = await pool.query(
      'SELECT * FROM user_seller_ratings WHERE user_id = $1 AND seller_id = $2',
      [user_id, id]
    );
    if (ratingQuery.rowCount > 0)
      return res.status(400).send('You already rated this seller');
    await pool.query(
      'INSERT INTO user_seller_ratings(user_id, seller_id, rating) VALUES($1, $2, $3)',
      [user_id, id, rating]
    );
    const allRatings = await pool.query(
      'SELECT * FROM user_seller_ratings WHERE seller_id = $1',
      [id]
    );
    let newRating = 0,
      newPeopleRated = 0;
    for (let row of allRatings.rows) {
      newRating += parseInt(row.rating);
      newPeopleRated++;
      console.log(newRating + ' ' + newPeopleRated + ' ' + row.rating);
    }
    newRating /= newPeopleRated;
    const updatedSeller = await pool.query(
      'UPDATE sellers SET rating = $1, people_rated = $2 WHERE id = $3 RETURNING id, name, category, lat, long, location_name, rating, people_rated, open_time, close_time, image',
      [newRating, newPeopleRated, id]
    );
    return res.status(200).send(updatedSeller.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id/orders', async (req, res) => {
  // return user id, seller id, partner id, user_name, user_image, order_price, order_status, all individual products name, id, image, quantity, and price
  try {
    const { order_type } = req.query;
    const { id } = req.params;
    if (order_type == 'ongoing') {
      let allOrders = await pool.query(
        'SELECT o.id, o.user_id, o.seller_id, o.partner_id, u.name AS user_name, u.image AS user_image, o.order_price, o.order_status FROM orders o JOIN users u ON o.user_id = u.id WHERE (o.order_status = $1 OR o.order_status = $2 OR o.order_status = $3) AND o.seller_id = $4',
        ['ordered', 'accepted', 'delivering', id]
      );
      for (let i = 0; i < allOrders.rows.length; i++) {
        let product = await pool.query(
          'SELECT p.id, p.name, p.image, p.price, quantity FROM order_products JOIN products p ON product_id = p.id WHERE order_id = $1',
          [allOrders.rows[i].id]
        );
        allOrders.rows[i].products = product.rows;
      }
      return res.status(200).send(allOrders.rows);
    } else if (order_type == 'completed') {
      let completedOrders = await pool.query(
        'SELECT o.id, o.user_id, o.seller_id, o.partner_id, u.name AS user_name, u.image AS user_image, o.order_price, o.order_status FROM orders o JOIN users u ON o.user_id = u.id WHERE o.order_status = $1 AND o.seller_id = $2',
        ['delivered', id]
      );
      for (let i = 0; i < completedOrders.rows.length; i++) {
        let product = await pool.query(
          'SELECT p.id, p.name, p.image, p.price, quantity FROM order_products JOIN products p ON product_id = p.id WHERE order_id = $1',
          [completedOrders.rows[i].id]
        );
        completedOrders.rows[i].products = product.rows;
      }
      return res.status(200).send(completedOrders.rows);
    } else {
      return res.status(400).send('Wrong order_type parameter');
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
