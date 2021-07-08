const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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

router.post('/', upload.single('image'), async (req, res) => {
  // Email, Name, Password, Lat, Long, [Categories]
  try {
    let {
      name,
      email,
      password,
      lat,
      long,
      category,
      open_time,
      close_time,
      location_name,
    } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM sellers WHERE email = $1',
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
      'INSERT INTO sellers(full_name, email, pass, category, lat, long, location_name, open_time, close_time, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, full_name AS name, email, category, lat, long, location_name, open_time, close_time, image',
      [
        name,
        email,
        password,
        category,
        lat,
        long,
        location_name,
        open_time,
        close_time,
        image,
      ]
    );
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(201).send(newUser.rows[0]);
  } catch (err) {
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
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
        'SELECT id, full_name AS name, email, category, lat, long, location_name, rating, people_rated, open_time, close_time, image FROM sellers WHERE email = $1',
        [email]
      );
      return res.status(200).send(seller.rows[0]);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/:id/products', async (req, res) => {
  // Get all products from a seller
  try {
    if (req.query.limit) {
      const products = await pool.query(
        'SELECT sellers.id AS seller_id, sellers.full_name AS seller_name, products.id AS product_id, products.name AS product_name, products.image AS product_image, products.price FROM sellers JOIN products ON sellers.id = products.seller_id WHERE sellers.id = $1 LIMIT $2',
        [req.params.id, req.query.limit]
      );
      return res.status(200).send(products.rows);
    } else {
      const products = await pool.query(
        'SELECT sellers.id AS seller_id, sellers.full_name AS seller_name, products.id AS product_id, products.name AS product_name, products.image AS product_image, products.price FROM sellers JOIN products ON sellers.id = products.seller_id WHERE sellers.id = $1',
        [req.params.id]
      );
      return res.status(200).send(products.rows);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/:id', async (req, res) => {
  // return Name, Id, Open, Close and Rating
  try {
    const seller = await pool.query(
      'SELECT id, full_name AS name, category, lat, long, location_name, rating, people_rated, open_time, close_time, image FROM sellers WHERE id = $1',
      [req.params.id]
    );
    return res.status(200).send(seller.rows[0]);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/', async (req, res) => {
  // Get all the shops of a particular category
  try {
    const sellers = await pool.query(
      'SELECT id, full_name AS name, category, rating, people_rated, lat, long, location_name, open_time, close_time, image FROM sellers WHERE LOWER(category) = LOWER($1)',
      [req.query.category]
    );
    return res.status(200).send(sellers.rows);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put('/:id/rating', async (req, res) => {
  try {
    const ratingQuery = await pool.query(
      'SELECT * FROM user_seller_ratings WHERE user_id = $1 AND seller_id = $2',
      [req.body.user_id, req.params.id]
    );
    if (ratingQuery.rows[0])
      return res.status(400).send('You already rated this seller');
    await pool.query(
      'INSERT INTO user_seller_ratings(user_id, seller_id, rating) VALUES($1, $2, $3)',
      [req.body.user_id, req.params.id, req.body.rating]
    );
    const allRatings = await pool.query(
      'SELECT * FROM user_seller_ratings WHERE seller_id = $1',
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
      'UPDATE sellers SET rating = $1, people_rated = $2 WHERE id = $3 RETURNING id, full_name AS name, email, lat, long, rating, people_rated, open_time, close_time',
      [newRating, newPeopleRated, req.params.id]
    );
    return res.status(200).send(newProduct.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id/orders', async (req, res) => {
  // return user id, seller id, partner id, user_name, user_image, order_price, order_status, all individual products name, id, image, quantity, and price
  try {
    if (req.query.order_type == 'ongoing') {
      let allOrders = await pool.query(
        'SELECT order_id, user_id, seller_id, partner_id, u.full_name AS user_name, u.image AS user_image, order_price, order_status FROM orders JOIN users u ON user_id = u.id WHERE (order_status = $1 OR order_status = $2 OR order_status = $3) AND seller_id = $4',
        ['ordered', 'accepted', 'delivering', req.params.id]
      );
      for (let i = 0; i < allOrders.rows.length; i++) {
        let product = await pool.query(
          'SELECT p.id, p.name, p.image, p.price, quantity FROM order_products JOIN products p ON product_id = p.id WHERE order_id = $1',
          [allOrders.rows[i].order_id]
        );
        allOrders.rows[i].products = product.rows;
      }
      return res.status(200).send(allOrders.rows);
    } else {
      let completedOrders = await pool.query(
        'SELECT order_id, user_id, seller_id, partner_id, u.full_name AS user_name, u.image AS user_image, order_price, order_status FROM orders JOIN users u ON user_id = u.id WHERE order_status = $1 AND seller_id = $2',
        ['delivered', req.params.id]
      );
      for (let i = 0; i < completedOrders.rows.length; i++) {
        let product = await pool.query(
          'SELECT p.id, p.name, p.image, p.price, quantity FROM order_products JOIN products p ON product_id = p.id WHERE order_id = $1',
          [completedOrders.rows[i].order_id]
        );
        completedOrders.rows[i].products = product.rows;
      }
      return res.status(200).send(completedOrders.rows);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

async function uploadFile(filePath, destFileName) {
  await gc.bucket('near-me-files').upload(filePath, {
    destination: destFileName,
  });
}

// function validateSellerRegistration(seller) {
//   const schema = Joi.object({
//     email: Joi.string().email().max(200).required(),
//     name: Joi.string().min(3).max(50).required(),
//     password: Joi.string().min(8).max(20).required(),
//     lat: Joi.string().required(),
//     long: Joi.string().required(),
//     categories: Joi.array()
//       .min(1)
//       .max(10)
//       .items(Joi.string())
//       .unique()
//       .required(),
//     open_time: Joi.any(),
//     close_time: Joi.any(),
//   });

//   return schema.validate(seller);
// }

// function validateSellerLogin(seller) {
//   const schema = Joi.object({
//     email: Joi.string().email().min(5).max(200).required(),
//     password: Joi.string().min(8).max(20).required(),
//   });

//   return schema.validate(seller);
// }

module.exports = router;
