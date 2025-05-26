// controllers/videoController.js
const Video = require("../models/Video");
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const Comment = require("../models/Comment");
const Gift = require("../models/Gift");

// 🎁 Gift the Creator
exports.giftCreator = async (req, res) => {
  try {
    const senderId = req.user;
    const { videoId, amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Invalid gift amount" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const creatorId = video.creator;

    if (String(creatorId) === String(senderId)) {
      return res
        .status(400)
        .json({ message: "You cannot gift your own video" });
    }

    const sender = await User.findById(senderId);
    if (sender.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct amount
    sender.wallet -= amount;
    await sender.save();

    // Log the gift
    await Gift.create({
      senderId,
      creatorId,
      videoId,
      amount,
    });

    res.json({
      message: `Gifted ₹${amount} to creator`,
      newBalance: sender.wallet,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 📝 Post a comment
exports.addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const userId = req.user;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = await Comment.create({ userId, videoId, text });
    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🧾 Get all comments for a video
exports.getComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const comments = await Comment.find({ videoId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    const formatted = comments.map((c) => ({
      _id: c._id,
      text: c.text,
      user: c.userId.username,
      createdAt: c.createdAt,
    }));

    res.json({ comments: formatted });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 🛒 Purchase a video
exports.purchaseVideo = async (req, res) => {
  const userId = req.user;
  const { videoId } = req.body;

  try {
    const video = await Video.findById(videoId);
    if (!video || video.type !== "long") {
      return res.status(400).json({ message: "Invalid video for purchase" });
    }

    // Already purchased?
    const alreadyPurchased = await Purchase.findOne({ userId, videoId });
    if (alreadyPurchased) {
      return res.status(400).json({ message: "Already purchased" });
    }

    const user = await User.findById(userId);

    if (user.wallet < video.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.wallet -= video.price;
    await user.save();

    // Save purchase
    await Purchase.create({ userId, videoId });

    res.json({ message: "Purchase successful", newBalance: user.wallet });
  } 
  catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getFeed = async (req, res) => {
  try {
    const userId = req.user;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate('creator', 'username');

    const purchases = await Purchase.find({ userId });
    const purchasedIds = purchases.map((p) => p.videoId.toString());

    const feed = videos.map((video) => {
      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        type: video.type,
        creator: video.creator.username,
        videoUrl: video.type === 'short' ? `http://localhost:8000/${video.videoFile}` : video.videoUrl,
        price: video.price,
        purchased: video.type === 'long' ? purchasedIds.includes(video._id.toString()) : true
      };
    });

    res.json({ feed });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, type, videoUrl, price } = req.body;
    const userId = req.user;

    let videoData = {
      creator: userId,
      title,
      description,
      type,
    };

    if (type === "short") {
      if (!req.file)
        return res
          .status(400)
          .json({ message: "Short-form video file required" });
      videoData.videoFile = req.file.path;
    } else if (type === "long") {
      if (!videoUrl)
        return res
          .status(400)
          .json({ message: "Long-form video URL required" });
      videoData.videoUrl = videoUrl;
      videoData.price = price || 0;
    }

    const newVideo = new Video(videoData);
    await newVideo.save();

    res
      .status(201)
      .json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
