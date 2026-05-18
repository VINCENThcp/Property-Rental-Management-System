require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
<<<<<<< feature-booking
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handler
app.use(errorHandler);
=======
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
const offerRoutes = require('./routes/offerRoutes');
app.use('/api/offers', offerRoutes);
>>>>>>> dev

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });