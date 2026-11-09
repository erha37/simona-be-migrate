const express = require('express');
const multer = require('multer');
const path = require('path');
const ContactsController = require('../controllers/ContactsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Contacts routes
router.get('/contacts', authMiddleware, (req, res) => ContactsController.index(req, res));
router.get('/contacts/new', authMiddleware, (req, res) => ContactsController.create(req, res));
router.post('/contacts/upload', authMiddleware, upload.single('file'), (req, res) => ContactsController.upload(req, res));

module.exports = router;
