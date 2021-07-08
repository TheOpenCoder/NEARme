const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const multer = require('multer');
const path = require('path');
const multStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
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
  // Name, email, password, lat, long, location_name
  try {
    let { name, email, password, lat, long, location_name } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM partners WHERE email = $1',
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
    let newPartner = await pool.query(
      'INSERT INTO partners(full_name, email, pass, lat, long, location_name, image) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, full_name AS name, lat, long, location_name, image',
      [name, email, password, lat, long, location_name, image]
    );
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(201).send(newPartner.rows[0]);
  } catch (err) {
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // email, password
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const emailQuery = await pool.query(
      'SELECT email FROM partners WHERE email = $1',
      [email]
    );
    if (emailQuery.rowCount == 0)
      return res.status(400).send('Email or password incorrect');
    const passQuery = await pool.query(
      'SELECT pass FROM partners WHERE email = $1',
      [email]
    );
    const passMatched = await bcrypt.compare(password, passQuery.rows[0].pass);
    // console.log(passMatched);
    if (!passMatched)
      return res.status(400).send('Email or password incorrect');
    else {
      const partner = await pool.query(
        'SELECT id, full_name AS name, email, lat, long, location_name, image FROM partners WHERE email = $1',
        [email]
      );
      return res.status(200).send(partner.rows[0]);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/:id/orders', async (req, res) => {
  // THERE WILL BE 4 STAGES FOR AN ORDER -> ORDERED, ACCEPTED, DELIVERING, DELIVERED
  try {
    const statusQuery = await pool.query(
      'SELECT order_id, seller_id, user_id, s.full_name AS seller_name, s.lat AS seller_lat, s.long AS seller_long, u.full_name AS user_name, u.image AS user_image, u.lat AS user_lat, u.long AS user_long FROM orders JOIN sellers s ON seller_id = s.id JOIN users u ON user_id = u.id WHERE partner_id = $1 AND (order_status = $2 OR order_status = $3)',
      [req.params.id, 'accepted', 'delivery']
    );
    if (statusQuery.rows[0]) return res.status(400).send(statusQuery.rows[0]);
    const allOrders = await pool.query(
      'SELECT order_id, seller_id, user_id, s.full_name AS seller_name, s.lat AS seller_lat, s.long AS seller_long, u.full_name AS user_name, u.image AS user_image, u.lat AS user_lat, u.long AS user_long FROM orders JOIN sellers s ON seller_id = s.id JOIN users u ON user_id = u.id WHERE order_status = $1 ORDER BY delivery_price DESC',
      ['ordered']
    );
    return res.status(200).send(allOrders.rows);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/accept', async (req, res) => {
  try {
    const statusQuery = await pool.query(
      'SELECT order_status FROM orders WHERE order_id = $1',
      [req.body.order_id]
    );
    if (statusQuery.rows[0].order_status != 'ordered')
      return res
        .status(400)
        .send('Sorry! Someone else accepted the delivery just now!');
    const order = await pool.query(
      'UPDATE orders SET order_status = $1, partner_id = $2 WHERE order_id = $3 RETURNING *',
      ['accepted', req.params.id, req.body.order_id]
    );
    return res.status(200).send(order.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/receive', async (req, res) => {
  try {
    const order = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *',
      ['delivering', req.body.order_id]
    );
    return res.status(200).send(order.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/deliver', async (req, res) => {
  try {
    const order = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *',
      ['delivered', req.body.order_id]
    );
    return res.status(200).send(order.rows[0]);
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

module.exports = router;
