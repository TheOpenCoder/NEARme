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
  // Name, email, password, lat, long, location_name
  try {
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
      'SELECT email FROM partners WHERE email = $1',
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
      let newPartner = await pool.query(
        'INSERT INTO partners(name, email, pass, lat, long, location_name, address, country_code, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
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
      return res.status(201).send(newPartner.rows[0]);
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
    const partnerQuery = await pool.query(
      'SELECT * FROM partners WHERE id = $1',
      [id]
    );
    if (partnerQuery.rowCount <= 0)
      return res.status(400).send('No such partner exists');
    const newPartner = await pool.query(
      'UPDATE partners SET customer_id = $1, wallet_id = $2 WHERE id = $3 RETURNING *',
      [customer_id, wallet_id, id]
    );
    return res.status(200).send(newPartner.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/kyc', async (req, res) => {
  try {
    const { kyc_verified } = req.body;
    const { id } = req.params;
    const updatedPartner = await pool.query(
      'UPDATE partners SET kyc_verified = $1 WHERE id = $2 RETURNING *',
      [kyc_verified, id]
    );
    return res.status(200).send(updatedPartner.rows[0]);
  } catch (err) {
    console.log(err);
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
    if (emailQuery.rowCount <= 0)
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
        'SELECT * FROM partners WHERE email = $1',
        [email]
      );
      return res.status(200).send(partner.rows[0]);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/:id/orders', async (req, res) => {
  // THERE WILL BE 4 STAGES FOR AN ORDER -> ORDERED, ACCEPTED, DELIVERING, DELIVERED
  try {
    const { id } = req.params;
    const statusQuery = await pool.query(
      'SELECT o.id, o.seller_id, o.user_id, s.name AS seller_name, s.lat AS seller_lat, s.long AS seller_long, u.name AS user_name, u.image AS user_image, u.lat AS user_lat, u.long AS user_long FROM orders o JOIN sellers s ON o.seller_id = s.id JOIN users u ON o.user_id = u.id WHERE o.partner_id = $1 AND (o.order_status = $2 OR o.order_status = $3)',
      [id, 'accepted', 'delivery']
    );
    if (statusQuery.rows[0]) return res.status(400).send(statusQuery.rows[0]);
    const allOrders = await pool.query(
      'SELECT o.id, o.seller_id, o.user_id, s.name AS seller_name, s.lat AS seller_lat, s.long AS seller_long, u.name AS user_name, u.image AS user_image, u.lat AS user_lat, u.long AS user_long FROM orders o JOIN sellers s ON o.seller_id = s.id JOIN users u ON o.user_id = u.id WHERE o.order_status = $1 ORDER BY o.delivery_price DESC',
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
    const { order_id } = req.body;
    const { id } = req.params;
    const statusQuery = await pool.query(
      'SELECT order_status FROM orders WHERE id = $1',
      [order_id]
    );
    if (statusQuery.rows[0].order_status != 'ordered')
      return res
        .status(400)
        .send('Sorry! Someone else accepted the delivery just now!');
    const order = await pool.query(
      'UPDATE orders SET order_status = $1, partner_id = $2 WHERE id = $3 RETURNING *',
      ['accepted', id, order_id]
    );
    return res.status(200).send(order.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/receive', async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
      ['delivering', order_id]
    );
    return res.status(200).send(order.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put('/:id/deliver', async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
      ['delivered', order_id]
    );
    return res.status(200).send(order.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
