require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const billingRoutes = require('./routes/billingRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const laboratoryRoutes = require('./routes/laboratoryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/laboratory', laboratoryRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medical Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
