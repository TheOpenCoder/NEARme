const express = require('express');
const router = express.Router();
const pool = require('../db');
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
// const { pathToFileURL } = require('url');
const gc = new Storage();
const fs = require('fs');

router.post('/', upload.single('image'), async (req, res) => {
  // Accepts seller_id and product image
  try {
    uploadFile(req.file.path, req.file.filename).catch(console.error);
    const image =
      'https://storage.googleapis.com/near-me-files/' + req.file.filename;
    const newAd = await pool.query(
      'INSERT INTO ads(product_id, seller_id, image) VALUES($1, $2, $3) RETURNING *',
      [req.body.product_id, req.body.seller_id, image]
    );
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(200).send(newAd.rows[0]);
  } catch (err) {
    fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    return res.status(400).send(err);
  }
});

router.get('/', async (req, res) => {
  // If limit exists in query params, return a limited number of ads otherwise returns all the ads in the system
  try {
    if (req.query.limit) {
      const limitAds = await pool.query('SELECT * FROM ads LIMIT $1', [
        req.query.limit,
      ]);
      return res.status(200).send(limitAds.rows);
    } else {
      const allAds = await pool.query('SELECT * FROM ads');
      return res.status(200).send(allAds.rows);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

async function uploadFile(filePath, destFileName) {
  await gc.bucket('near-me-files').upload(filePath, {
    destination: destFileName,
  });
}

module.exports = router;
