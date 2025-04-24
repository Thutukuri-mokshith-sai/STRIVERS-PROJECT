const express = require('express');
const pool = require('../db');  // Import the pool object from db.js
const router = express.Router();

// Function to get all active items from the tables
const getActiveItems = async () => {
  try {
    // Queries to fetch active records from each table
    const labourQuery = `SELECT * FROM labour WHERE status = 'active'`;
    const tractorQuery = `SELECT * FROM tractor WHERE status = 'active'`;
    const jcbQuery = `SELECT * FROM jcb WHERE status = 'active'`;
    const sprayersQuery = `SELECT * FROM sprayers WHERE status = 'active'`;
    const harvestorsQuery = `SELECT * FROM harvestors WHERE status = 'active'`;
    const logisticsQuery = `SELECT * FROM logistics WHERE status = 'active'`;

    // Execute all queries concurrently using Promise.all
    const [
      labourData,
      tractorData,
      jcbData,
      sprayersData,
      harvestorsData,
      logisticsData,
    ] = await Promise.all([
      pool.query(labourQuery),
      pool.query(tractorQuery),
      pool.query(jcbQuery),
      pool.query(sprayersQuery),
      pool.query(harvestorsQuery),
      pool.query(logisticsQuery),
    ]);

    // Return the combined data
    return {
      labour: labourData.rows,
      tractor: tractorData.rows,
      jcb: jcbData.rows,
      sprayers: sprayersData.rows,
      harvestors: harvestorsData.rows,
      logistics: logisticsData.rows,
    };
  } catch (err) {
    console.error('Error fetching active items:', err);
    throw err;
  }
};

// Route to get all active items
router.get('/active-items', async (req, res) => {
  try {
    const activeItems = await getActiveItems();
    res.json(activeItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active items' });
  }
});

module.exports = router;
