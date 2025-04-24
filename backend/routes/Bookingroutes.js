const express = require('express');
const pool = require('../db');

const router = express.Router();

// Utility function to generate routes
const createBookingRoutes = (type, idColumn) => {
  const table = `${type}_bookings`;

  // Create a booking
  router.post(`/${type}`, async (req, res) => {
    console.log('booking');
    const { farmer_id, [idColumn]: resource_id } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO ${table} (farmer_id, ${idColumn}) VALUES ($1, $2) RETURNING *`,
        [farmer_id, resource_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  // Get all bookings
  router.get(`/${type}`, async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table}`);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // Update booking
  router.put(`/${type}/:id`, async (req, res) => {
    const { id } = req.params;
    const { status, approved_by_provider } = req.body;
    try {
      const result = await pool.query(
        `UPDATE ${table} SET status = $1, approved_by_provider = $2 WHERE booking_id = $3 RETURNING *`,
        [status, approved_by_provider, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  // Delete booking
  router.delete(`/${type}/:id`, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query(`DELETE FROM ${table} WHERE booking_id = $1`, [id]);
      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete booking' });
    }
  });
};

// Create routes for all booking types
createBookingRoutes('tractor', 'tractor_id');
createBookingRoutes('labour', 'labour_id');
createBookingRoutes('jcb', 'jcb_id');
createBookingRoutes('sprayer', 'sprayer_id');
createBookingRoutes('harvestor', 'harvestor_id');
createBookingRoutes('logistics', 'logistics_id');

module.exports = router;
