const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One record per user per problem
progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
