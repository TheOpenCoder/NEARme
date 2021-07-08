const express = require('express');
const router = express.Router();
const _ = require('lodash');
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const multStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: multStorage,
});
const { Storage } = require('@google-cloud/storage');
const gc = new Storage();
const fs = require('fs');

router.get('/', async (req, res) => {
  // Select all products matching the search term or all products relating to a category
  try {
    if (req.query.category) {
      const products = await pool.query(
        'SELECT products.id AS product_id, products.name AS product_name, products.image AS product_image, sellers.id AS seller_id, sellers.full_name AS seller_name, products.price FROM products JOIN sellers ON products.seller_id = sellers.id WHERE products.category = $1',
        [req.query.category]
      );
      return res.status(200).send(products.rows);
    } else {
      const products = await pool.query(
        'SELECT products.id AS product_id, products.name AS product_name, products.image AS product_image, sellers.id AS seller_id, sellers.full_name AS seller_name, products.price FROM products JOIN sellers ON products.seller_id = sellers.id WHERE LOWER(products.name) LIKE LOWER($1)',
        [req.query.search + '%']
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
    let product = await pool.query(
      'SELECT \
      products.id AS product_id, products.name AS product_name, products.image AS product_image,\
      products.price, products.rating, sellers.id, sellers.full_name  AS seller_name, \
      sellers.open_time, sellers.close_time \
      FROM products \
      JOIN sellers \
      ON products.seller_id = sellers.id \
      WHERE products.id = $1',
      [req.params.id]
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
    console.log(req.file);
    const { name, category, seller_id, price } = req.body;
    uploadFile(req.file.path, req.file.filename).catch(console.error);
    const image =
      'https://storage.googleapis.com/near-me-files/' + req.file.filename;
    let newProduct = await pool.query(
      'INSERT INTO products(name, category, seller_id, price, image) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [name, category, seller_id, price, image]
    );
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(201).send(newProduct.rows[0]);
  } catch (err) {
    console.log(err);
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(400).send(err);
  }
});

router.put('/:id/rating', async (req, res) => {
  try {
    const ratingQuery = await pool.query(
      'SELECT * FROM user_product_ratings WHERE user_id = $1 AND product_id = $2',
      [req.body.user_id, req.params.id]
    );
    if (ratingQuery.rows[0])
      return res.status(400).send('You already rated this product');
    await pool.query(
      'INSERT INTO user_product_ratings(user_id, product_id, rating) VALUES($1, $2, $3)',
      [req.body.user_id, req.params.id, req.body.rating]
    );
    const allRatings = await pool.query(
      'SELECT * FROM user_product_ratings WHERE product_id = $1',
      [req.params.id]
    );
    let newRating = 0,
      newPeopleRated = 0;
    for (let row of allRatings.rows) {
      newRating += row.rating;
      newPeopleRated++;
    }
    newRating /= newPeopleRated;
    const newProduct = await pool.query(
      'UPDATE products SET rating = $1, people_rated = $2 WHERE id = $3 RETURNING *',
      [newRating, newPeopleRated, req.params.id]
    );
    return res.status(200).send(newProduct.rows[0]);
  } catch (err) {
    return res.status(400).send(err);
  }
});

async function uploadFile(filePath, destFileName) {
  await gc.bucket('near-me-files').upload(filePath, {
    destination: destFileName,
  });
}

// function validateProductPost(product) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(50).required(),
//     seller_id: Joi.number().required(),
//     category: Joi.string().required(),
//     price: Joi.number().required(),
//   });

//   return schema.validate(product);
// }

module.exports = router;
