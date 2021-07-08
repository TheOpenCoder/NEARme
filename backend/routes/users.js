const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const _ = require('lodash');
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
const gc = new Storage({
  keyFilename: path.join(__dirname, '../near-me-backend-dca4581445ec.json'),
  projectId: 'near-me-backend',
});
const fs = require('fs');

router.post('/', upload.single('image'), async (req, res) => {
  // Requires Email, Name, Password, Location
  try {
    let { name, email, password, lat, long, location_name } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );
    if (emailQuery.rowCount > 0) {
      fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
      return res.status(400).send('Email ID already exists');
    }
    password = await bcrypt.hash(password, 10);
    uploadFile(req.file.path, req.file.filename).catch(console.error);
    const image =
      'https://storage.googleapis.com/near-me-files/' + req.file.filename;
    let newUser = await pool.query(
      'INSERT INTO users(full_name, email, pass, lat, long, location_name, image) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, full_name AS name, email, lat, long, location_name, image',
      [name, email, password, lat, long, location_name, image]
    );
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(201).send(newUser.rows[0]);
  } catch (err) {
    console.log(err);
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
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
    if (emailQuery.rowCount == 0)
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
        'SELECT id, full_name AS name, email, lat, long, lend_limit, borrow_limit, location_name, image FROM users WHERE users.email = $1',
        [email]
      );
      return res.status(200).send(user.rows[0]);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post('/:id/wishlist', async (req, res) => {
  // Get Product Id
  try {
    const productQuery = await pool.query(
      'SELECT * FROM users_wishlist WHERE product_id = $1 AND user_id = $2',
      [req.body.product_id, req.params.id]
    );
    if (productQuery.rows[0])
      return res.status(400).send('Product already present in wishlist');
    const newProduct = await pool.query(
      'INSERT INTO users_wishlist(user_id, product_id) VALUES($1, $2) RETURNING *',
      [req.params.id, req.body.product_id]
    );
    return res.status(200).send(newProduct.rows[0]);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/:id/wishlist', async (req, res) => {
  try {
    const products = await pool.query(
      'SELECT products.id AS product_id, products.name AS product_name, products.image AS product_image, products.price, products.seller_id, sellers.full_name AS seller_name FROM users_wishlist JOIN products ON users_wishlist.product_id = products.id JOIN sellers ON products.seller_id = sellers.id WHERE users_wishlist.user_id = $1',
      [req.params.id]
    );
    return res.status(200).send(products.rows);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.delete('/:id/wishlist', async (req, res) => {
  try {
    const deletedProduct = await pool.query(
      'DELETE FROM users_wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.params.id, req.body.product_id]
    );
    if (deletedProduct.rows[0])
      return res.status(200).send(deletedProduct.rows[0]);
    else return res.status(404).send('Not Present');
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post('/:id/bag', async (req, res) => {
  try {
    const productQuery = await pool.query(
      'SELECT * FROM users_bag WHERE product_id = $1 AND user_id = $2',
      [req.body.product_id, req.params.id]
    );
    if (productQuery.rows[0]) {
      const updatedBag = await pool.query(
        'UPDATE users_bag SET quantity = $1 WHERE product_id = $2 AND user_id = $3 RETURNING *',
        [req.body.quantity, req.params.id, req.body.product_id]
      );
      return res.status(200).send(updatedBag.rows[0]);
    }
    const newProduct = await pool.query(
      'INSERT INTO users_bag(user_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *',
      [req.params.id, req.body.product_id, req.body.quantity]
    );
    return res.status(200).send(newProduct.rows[0]);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/:id/bag', async (req, res) => {
  try {
    const products = await pool.query(
      'SELECT products.id AS product_id, products.name AS product_name, quantity, products.image AS product_image, products.price, products.seller_id, sellers.full_name AS seller_name FROM users_bag JOIN products ON users_bag.product_id = products.id JOIN sellers ON products.seller_id = sellers.id WHERE users_bag.user_id = $1',
      [req.params.id]
    );
    return res.status(200).send(products.rows);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete('/:id/bag', async (req, res) => {
  try {
    const deletedProduct = await pool.query(
      'DELETE FROM users_bag WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.params.id, req.body.product_id]
    );
    if (deletedProduct.rows[0])
      return res.status(200).send(deletedProduct.rows[0]);
    else return res.status(404).send('Not Present');
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put('/:id/lendlimit', async (req, res) => {
  try {
    const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [
      req.params.id,
    ]);
    if (!userQuery.rows[0]) return res.status(400).send('User not present');
    const updatedUser = await pool.query(
      'UPDATE users SET lend_limit = $1 WHERE id = $2 RETURNING id, full_name AS name, email, lend_limit, borrow_limit, lat, long',
      [req.body.lend_limit, req.params.id]
    );
    return res.status(200).send(updatedUser.rows[0]);
  } catch (err) {
    return res.status(400).send(err);
  }
});

async function uploadFile(filePath, destFileName) {
  await gc.bucket('near-me-files').upload(filePath, {
    destination: destFileName,
  });
}

// function validateUserRegistration(user) {
//   const schema = Joi.object({
//     email: Joi.string().email().max(200).required(),
//     name: Joi.string().min(3).max(50).required(),
//     password: Joi.string().min(8).max(20).required(),
//     lend_limit: Joi.number().min(1000).max(20000),
//     lat: Joi.string().required(),
//     long: Joi.string().required(),
//     location_name: Joi.string().required(),
//   });

//   return schema.validate(user);
// }

// function validateUserLogin(user) {
//   const schema = Joi.object({
//     email: Joi.string().email().min(5).max(200).required(),
//     password: Joi.string().min(8).max(20).required(),
//   });

//   return schema.validate(user);
// }

module.exports = router;
