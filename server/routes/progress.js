const express = require('express');
const router = express.Router();
const { getProgress, toggleProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProgress);
router.post('/toggle', protect, toggleProgress);

module.exports = router;
