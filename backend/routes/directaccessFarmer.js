// productRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const pool = require('../db'); // Import the database connection
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const router = express.Router();

// Configure Cloudinary with the provided URL from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split('@')[1].split(':')[0], 
  api_key: process.env.CLOUDINARY_URL.split(':')[1].split('@')[0], 
  api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0]
});

// Multer configuration for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 1. Add Product
router.post('/add-product', upload.single('image'), async (req, res) => {
  const { farmer_id, name, description, price_per_kg, quantity, region } = req.body;

  try {
    let image_url = null;

    // If image is provided, upload to Cloudinary
    if (req.file) {
      await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Image upload failed' });
          }
          image_url = result.secure_url;
        }
      ).end(req.file.buffer);
    }

    const result = await pool.query(
      `INSERT INTO products (farmer_id, name, description, price_per_kg, quantity, region, image_url, date_added)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [farmer_id, name, description, price_per_kg, quantity, region, image_url]
    );

    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// 2. Remove Product
router.delete('/remove-product/:product_id', async (req, res) => {
  const { product_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM products WHERE product_id = $1 RETURNING *`,
      [product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove product' });
  }
});

// 3. View Requests (Farmer)
router.get('/view-requests/:farmer_id', async (req, res) => {
  const { farmer_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM requests WHERE product_id IN (SELECT product_id FROM products WHERE farmer_id = $1)`,
      [farmer_id]
    );

    res.json({ requests: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// 4. View Products by Farmer ID
router.get('/farmer-products/:farmer_id', async (req, res) => {
  const { farmer_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE farmer_id = $1 ORDER BY date_added DESC`,
      [farmer_id]
    );

    res.json({ success: true, products: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch farmer products' });
  }
});

module.exports = router;
