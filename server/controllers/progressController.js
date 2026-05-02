const Progress = require('../models/Progress');

// GET /api/progress — all completed problem IDs for this user
const getProgress = async (req, res) => {
  try {
    const records = await Progress.find({ userId: req.user._id, completed: true });
    const completedIds = records.map((r) => r.problemId);
    res.json({ completedIds });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
};

// POST /api/progress/toggle
const toggleProgress = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: 'problemId is required' });
    }

    const existing = await Progress.findOne({ userId: req.user._id, problemId });

    if (existing) {
      existing.completed = !existing.completed;
      await existing.save();
      return res.json({ problemId, completed: existing.completed });
    }

    // First time marking this problem
    const record = await Progress.create({
      userId: req.user._id,
      problemId,
      completed: true,
    });

    res.json({ problemId: record.problemId, completed: record.completed });
  } catch (err) {
    console.error('Toggle progress error:', err);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

module.exports = { getProgress, toggleProgress };
