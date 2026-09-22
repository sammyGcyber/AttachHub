const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const listingRoutes = require('./routes/listingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Base Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AttachHub REST API is running' });
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`AttachHub Server running on http://localhost:${PORT}`);
});
