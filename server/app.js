const path = require('path');
// .env ada di root project (sejajar folder server/ & client/), bukan di dalam server/
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Cek koneksi database (Sequelize) saat server start
const { sequelize } = require('./src/models');
sequelize.authenticate()
  .then(() => console.log('Database (Sequelize) terkoneksi.'))
  .catch((err) => console.error('Gagal konek database:', err.message));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
const homeRoutes = require('./src/routes/homeRoutes');
const contactsRoutes = require('./src/routes/contactsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const groupsRoutes = require('./src/routes/groupsRoutes');
app.use('/api', homeRoutes);
app.use('/api', contactsRoutes);
app.use('/api', authRoutes);
app.use('/api', groupsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', msg: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', msg: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
