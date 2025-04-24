const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const service_Listing_routes=require('./routes/service_listings')
const app = express();
const PORT = 3000;
const Booking=require('./routes/Bookingroutes');
const active=require('./routes/activeItemsRouter');
const farmerbook=require('./routes/farmerbookingRoutes');
const farmerdirectaccess=require('./routes/directaccessFarmer');
app.use(cors());
app.use(bodyParser.json());

// DB connection test
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database!"))
  .catch(err => console.error("❌ Failed to connect to PostgreSQL database:", err));

app.use('/',farmerdirectaccess);
  // Routes
app.use('/', authRoutes);
app.use('/',service_Listing_routes);
app.use('/booking',Booking);
app.use('/',active);
app.use('/api/bookings',farmerbook);
// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
