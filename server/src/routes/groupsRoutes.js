const express = require('express');
const GroupsController = require('../controllers/GroupsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Groups routes
router.get('/groups', authMiddleware, (req, res) => GroupsController.getGroups(req, res));
router.get('/groups/summary', authMiddleware, (req, res) => GroupsController.getGroupSummary(req, res));
router.get('/groups/:kode_kegiatan', authMiddleware, (req, res) => GroupsController.getGroupDetail(req, res));

module.exports = router;