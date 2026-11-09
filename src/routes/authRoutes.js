const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/auth/login', (req, res) => AuthController.login(req, res));
router.post('/auth/logout', authMiddleware, (req, res) => AuthController.logout(req, res));
router.get('/auth/profile', authMiddleware, (req, res) => AuthController.getProfile(req, res));

module.exports = router;
