const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// DSA data is hardcoded — no DB needed for this.
// In future you could move this to MongoDB and let admins add problems.
const DSA_DATA = require('../data/dsaData');

// GET /api/dsa/topics
router.get('/topics', protect, (req, res) => {
  res.json(DSA_DATA);
});

module.exports = router;
