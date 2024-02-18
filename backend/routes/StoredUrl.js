const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const sharp = require("sharp");
const mongoose = require("mongoose");
const path = require("path");

// Import the StoredUrl model
const StoredUrl = require("../models/StoredUrl");

// Middleware
router.use(bodyParser.json());

// Set up storage for image uploads using Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new stored URL with image upload
router.post("/StoredUrls", upload.single("image"), async (req, res) => {
  try {
    // Process the uploaded image to create a 256x256 icon
    const iconBuffer = await sharp(req.file.buffer)
      .resize({ width: 256, height: 256 })
      .toBuffer();

    // Save the processed image to the "icons" directory
    const iconFilename = `icon_${Date.now()}.png`;
    const iconPath = `${iconFilename}`;

    await sharp(iconBuffer).toFile(path.join(__dirname, "../icons", iconFilename));

    const newStoredUrl = new StoredUrl({
      customName: req.body.customName,
      originalUrl: req.body.originalUrl,
      createdBy: req.body.createdBy,
      iconPath: iconPath, // Save the path to the icon
    });

    const savedUrl = await newStoredUrl.save();
    res.status(201).json(savedUrl);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stored URLs
router.get("/StoredUrls", async (req, res) => {
  try {
    const storedUrls = await StoredUrl.find();
    res.status(200).json(storedUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/StoredUrls/count/:customName", async (req, res) => {
  try {
    const storedUrl = await StoredUrl.findOneAndUpdate(
      { customName: req.params.customName },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!storedUrl) {
      res.status(404).json({ message: "Stored URL not found" });
      return;
    }

    res.status(200).json({
      message: "Click count incremented successfully",
      storedUrl: storedUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update a stored URL by customName
router.put("/StoredUrls/:customName", async (req, res) => {
  try {
    const updatedUrl = await StoredUrl.findOneAndUpdate(
      { customName: req.params.customName },
      req.body,
      { new: true }
    );
    if (!updatedUrl) {
      res.status(404).json({ message: "Stored URL not found" });
      return;
    }
    res.status(200).json(updatedUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a stored URL by ID
router.delete("/StoredUrls/:id", async (req, res) => {
  try {
    const deletedUrl = await StoredUrl.findOneAndDelete({ _id: req.params.id });
    if (!deletedUrl) {
      res.status(404).json({ message: "Stored URL not found" });
      return;
    }
    // Delete associated icon (you need to handle this)
    res.status(204).json({ message: "Stored URL deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;