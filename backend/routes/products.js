const express = require('express');
const router = express.Router();
const pool = require('../db');
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

router.get('/', async (req, res) => {
  // Select all products matching the search term or all products relating to a category
  try {
    const { category } = req.query;
    const { search } = req.query;
    if (category) {
      const products = await pool.query(
        'SELECT p.id AS product_id, p.name AS product_name, p.image AS product_image, s.id AS seller_id, s.name AS seller_name, p.price FROM products p JOIN sellers s ON p.seller_id = s.id WHERE LOWER(p.category) = LOWER($1)',
        [category]
      );
      return res.status(200).send(products.rows);
    } else {
      const products = await pool.query(
        'SELECT p.id AS product_id, p.name AS product_name, p.image AS product_image, s.id AS seller_id, s.name AS seller_name, p.price FROM products p JOIN sellers s ON p.seller_id = s.id WHERE LOWER(p.name) LIKE LOWER($1)',
        [search + '%']
      );
      return res.status(200).send(products.rows);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/:id', async (req, res) => {
  // Get a specific product
  try {
    const { id } = req.params;
    let product = await pool.query(
      'SELECT p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price, p.rating, s.id AS seller_id, s.name AS seller_name, s.open_time, s.close_time FROM products p JOIN sellers s ON p.seller_id = s.id WHERE p.id = $1',
      [id]
    );
    return res.status(200).send(product.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  // Post a product
  // Name, Category, seller_id, Price
  try {
    const { name, category, seller_id, price } = req.body;
    const newFilename = uuidv4() + '-' + req.file.originalname;
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream();
    blobStream.on('error', (err) => {
      console.log(err);
    });
    blobStream.on('finish', async () => {
      const image = 'https://storage.googleapis.com/near-me-files/' + blob.name;
      let newProduct = await pool.query(
        'INSERT INTO products(name, category, seller_id, price, image) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [name, category, seller_id, price, image]
      );
      return res.status(201).send(newProduct.rows[0]);
    });
    blobStream.end(req.file.buffer);
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
      'SELECT * FROM user_product_ratings WHERE user_id = $1 AND product_id = $2',
      [user_id, id]
    );
    if (ratingQuery.rowCount > 0)
      return res.status(400).send('You already rated this product');
    await pool.query(
      'INSERT INTO user_product_ratings(user_id, product_id, rating) VALUES($1, $2, $3)',
      [user_id, id, rating]
    );
    const allRatings = await pool.query(
      'SELECT * FROM user_product_ratings WHERE product_id = $1',
      [id]
    );
    let newRating = 0,
      newPeopleRated = 0;
    for (let row of allRatings.rows) {
      newRating += parseInt(row.rating);
      newPeopleRated++;
    }
    newRating /= newPeopleRated;
    const updatedProduct = await pool.query(
      'UPDATE products SET rating = $1, people_rated = $2 WHERE id = $3 RETURNING *',
      [newRating, newPeopleRated, id]
    );
    return res.status(200).send(updatedProduct.rows[0]);
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
