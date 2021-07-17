const express = require('express');
const router = express.Router();
const pool = require('../db');
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
  // Accepts seller_id and product image
  try {
    const { product_id, seller_id } = req.body;
    const adQuery = await pool.query(
      'SELECT * FROM ads WHERE product_id = $1',
      [product_id]
    );
    if (adQuery.rowCount > 0)
      return res.status(400).send('Ad already exists for this product');
    const newFilename = uuidv4() + '-' + req.file.originalname;
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream();
    blobStream.on('error', (err) => {
      console.log(err);
    });
    blobStream.on('finish', async () => {
      const image = 'https://storage.googleapis.com/near-me-files/' + blob.name;
      const newAd = await pool.query(
        'INSERT INTO ads(product_id, seller_id, image) VALUES($1, $2, $3) RETURNING *',
        [product_id, seller_id, image]
      );
      return res.status(200).send(newAd.rows[0]);
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get('/', async (req, res) => {
  // If limit exists in query params, return a limited number of ads otherwise returns all the ads in the system
  try {
    const { limit } = req.query;
    if (limit) {
      const limitAds = await pool.query(
        'SELECT a.id, a.product_id, a.image, p.name AS product_name, p.price, p.category, p.rating, p.people_rated, s.name AS seller_name, s.image AS seller_image FROM ads a JOIN products p ON a.product_id = p.id JOIN sellers s ON s.id = a.seller_id LIMIT $1',
        [limit]
      );
      return res.status(200).send(limitAds.rows);
    } else {
      const allAds = await pool.query(
        'SELECT a.id, a.product_id, a.image, p.name AS product_name, p.price, p.category, p.rating, p.people_rated, s.name AS seller_name, s.image AS seller_image FROM ads a JOIN products p ON a.product_id = p.id JOIN sellers s ON s.id = p.seller_id'
      );
      return res.status(200).send(allAds.rows);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
