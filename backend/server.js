require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./routes/auth');
const feedbackRoutes  = require('./routes/feedback');
const petRoutes       = require('./routes/pets');
const otpRoutes       = require('./routes/otp');
const adoptionRoutes  = require('./routes/adoptions');
const ngoRoutes       = require('./routes/ngo');
const reportRoutes    = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/feedback',  feedbackRoutes);
app.use('/api/pets',      petRoutes);
app.use('/api/otp',       otpRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/ngo',       ngoRoutes);
app.use('/api/reports',   reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
