const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📌 Helper function to handle queries
const queryHandler = async (res, query, params = []) => {
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// ==========================
// 🧑 LABOUR ROUTES
// ==========================
router.get('/labour', (req, res) => {
  console.log('/labour');
  queryHandler(res, 'SELECT * FROM labour');
});

router.post('/labour', (req, res) => {
  const { user_id, experience, status, location, wages } = req.body;

  if (!user_id || !experience || !status || !location || wages === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  queryHandler(res,
    'INSERT INTO labour (user_id, experience, status, location, wages) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, experience, status, location, wages]
  );
});

router.put('/labour/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  queryHandler(
    res,
    'UPDATE labour SET status = $1 WHERE user_id = $2 RETURNING *',
    [status, user_id]
  );
});

// ==========================
// 🚜 TRACTOR ROUTES
// ==========================
router.get('/tractor', (req, res) => {
  queryHandler(res, 'SELECT * FROM tractor');
});

router.post('/tractor', (req, res) => {
  const { user_id, model, capacity, status, location, rent } = req.body;

  if (!user_id || !model || !capacity || !status || !location || rent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  queryHandler(res,
    'INSERT INTO tractor (user_id, model, capacity, status, location, rent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, model, capacity, status, location, rent]
  );
});

router.put('/tractor/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  queryHandler(
    res,
    'UPDATE tractor SET status = $1 WHERE user_id = $2 RETURNING *',
    [status, user_id]
  );
});

// ==========================
// 🏗️ JCB ROUTES
// ==========================
router.get('/jcb', (req, res) => {
  queryHandler(res, 'SELECT * FROM jcb');
});

router.post('/jcb', (req, res) => {
  const { user_id, model, usage, status, location, rent } = req.body;

  if (!user_id || !model || !usage || !status || !location || rent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  queryHandler(res,
    'INSERT INTO jcb (user_id, model, usage, status, location, rent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, model, usage, status, location, rent]
  );
});

router.put('/jcb/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  queryHandler(
    res,
    'UPDATE jcb SET status = $1 WHERE user_id = $2 RETURNING *',
    [status, user_id]
  );
});

// ==========================
// 🌫️ SPRAYER ROUTES
// ==========================
router.get('/sprayers', (req, res) => {
  queryHandler(res, 'SELECT * FROM sprayers');
});

router.post('/sprayers', (req, res) => {
  const { user_id, type, range, status, location, rent } = req.body;

  if (!user_id || !type || !range || !status || !location || rent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  queryHandler(res,
    'INSERT INTO sprayers (user_id, type, range, status, location, rent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, type, range, status, location, rent]
  );
});

router.put('/sprayers/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  queryHandler(
    res,
    'UPDATE sprayers SET status = $1 WHERE user_id = $2 RETURNING *',
    [status, user_id]
  );
});

// ==========================
// 🌾 HARVESTOR ROUTES
// ==========================
router.get('/harvestors', (req, res) => {
  queryHandler(res, 'SELECT * FROM harvestors');
});

router.post('/harvestors', (req, res) => {
  const { user_id, model, capacity, status, location, rent } = req.body;

  if (!user_id || !model || !capacity || !status || !location || rent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  queryHandler(res,
    'INSERT INTO harvestors (user_id, model, capacity, status, location, rent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, model, capacity, status, location, rent]
  );
});

router.put('/harvestors/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  queryHandler(
    res,
    'UPDATE harvestors SET status = $1 WHERE user_id = $2 RETURNING *',
    [status, user_id]
  );
});

// ==========================
// 🚚 LOGISTICS ROUTES
// ==========================
router.get('/logistics', (req, res) => {
  queryHandler(res, 'SELECT * FROM logistics');
});

router.post('/logistics', (req, res) => {
  const { user_id, vehicle_number, capacity, status, location, rent } = req.body;

  if (!user_id || !vehicle_number || !capacity || !status || !location || rent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  queryHandler(res,
    'INSERT INTO logistics (user_id, vehicle_number, capacity, status, location, rent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, vehicle_number, capacity, status, location, rent]
  );
});

router.put('/logistics/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  queryHandler(
    res,
    'UPDATE logistics SET status = $1 WHERE user_id = $2 RETURNING *',
    [status, user_id]
  );
});

module.exports = router;
