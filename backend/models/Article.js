const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    tips: {
      type: [String],
      default: [],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    authorName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
