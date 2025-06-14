const express = require('express');
const { upload, uploadVideo, getVideosFeed, likeUnlikeVideo, addComment, getUserVideos } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/feed', getVideosFeed);
router.post('/like', protect, likeUnlikeVideo);
router.post('/comment', protect, addComment);
router.get('/user/:userId', getUserVideos); 

module.exports = router;