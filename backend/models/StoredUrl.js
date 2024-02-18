const mongoose = require("mongoose");

const storedUrlSchema = new mongoose.Schema({
  customName: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  iconPath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
});

const StoredUrl = mongoose.model("StoredUrl", storedUrlSchema);

module.exports = StoredUrl;