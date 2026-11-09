const express = require('express');
const HomeController = require('../controllers/HomeController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Home routes
router.get('/home', authMiddleware, (req, res) => HomeController.index(req, res));
router.get('/home/getChartData', authMiddleware, (req, res) => HomeController.getChartData(req, res));
router.get('/home/getChartRealisasi', authMiddleware, (req, res) => HomeController.getChartRealisasi(req, res));

module.exports = router;
