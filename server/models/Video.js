const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    type: { type: String, enum: ["short", "long"], required: true },
    videoUrl: String, // for long-form (external links)
    videoFile: String, // for short-form (uploaded .mp4 path)
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
