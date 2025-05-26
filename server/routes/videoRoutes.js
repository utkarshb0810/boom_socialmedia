// routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadVideo } = require("../controllers/videoController");
const { getFeed } = require("../controllers/videoController");
const { purchaseVideo } = require("../controllers/videoController");
const { addComment, getComments } = require("../controllers/videoController");
const { giftCreator } = require("../controllers/videoController");

router.post("/upload", authMiddleware, upload.single("videoFile"), uploadVideo);
router.get("/feed", authMiddleware, getFeed);

router.post("/purchase", authMiddleware, purchaseVideo);

router.post('/comment', authMiddleware, addComment);

router.get('/comments/:videoId', authMiddleware, getComments);


router.post("/gift", authMiddleware, giftCreator);



module.exports = router;
