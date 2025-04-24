const express = require('express');
const pool = require('../db'); // Importing the pool from db.js

const router = express.Router();

// Get all bookings for a specific user (farmer) by user_id
router.get('/:booking_type/user/:user_id', async (req, res) => {
  const { booking_type, user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM ${booking_type}_bookings WHERE farmer_id = $1`,
      [user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No bookings found for user ${user_id}` });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching bookings for user' });
  }
});

module.exports = router;
