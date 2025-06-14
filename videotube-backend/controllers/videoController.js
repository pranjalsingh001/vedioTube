const dotenv = require('dotenv');
dotenv.config();

const Video = require('../models/Video');
const User = require('../models/User');
const ImageKit = require('imagekit');
const multer = require('multer');
const path = require('path');

// Configure ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Configure Multer for file uploads (in-memory storage for ImageKit)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @desc    Upload video to ImageKit and save metadata to DB
// @route   POST /api/videos/upload
// @access  Private
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }
        if (!req.body.title) {
            return res.status(400).json({ message: 'Video title is required' });
        }

        // Upload to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer.toString('base64'), // Convert buffer to base64
            fileName: `${Date.now()}-${req.file.originalname}`,
            folder: '/videos', // Optional: specify a folder in ImageKit
            useUniqueFileName: true,
        });

        // Save video metadata to MongoDB
        const video = await Video.create({
            title: req.body.title,
            videoUrl: result.url,
            uploaderId: req.user._id, // req.user comes from authMiddleware
        });

        res.status(201).json({
            message: 'Video uploaded successfully',
            video,
        });
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: 'Server error during video upload' });
    }
};

// @desc    Get all videos for feed
// @route   GET /api/videos/feed
// @access  Public
const getVideosFeed = async (req, res) => {
    try {
        const videos = await Video.find({})
            .populate('uploaderId', 'username') // Populate uploader's username
            .populate('comments.userId', 'username') // Populate comment user's username
            .sort({ createdAt: -1 }); // Latest videos first
        res.json(videos);
    } catch (error) {
        console.error('Get videos feed error:', error);
        res.status(500).json({ message: 'Server error fetching videos' });
    }
};

// @desc    Like/unlike a video
// @route   POST /api/videos/like
// @access  Private
const likeUnlikeVideo = async (req, res) => {
    const { videoId } = req.body;
    const userId = req.user._id;

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const isLiked = video.likes.includes(userId);

        if (isLiked) {
            // Unlike
            video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
            await video.save();
            res.json({ message: 'Video unliked', likesCount: video.likes.length });
        } else {
            // Like
            video.likes.push(userId);
            await video.save();
            res.json({ message: 'Video liked', likesCount: video.likes.length });
        }
    } catch (error) {
        console.error('Like/unlike video error:', error);
        res.status(500).json({ message: 'Server error liking/unliking video' });
    }
};

// @desc    Add a comment to a video
// @route   POST /api/videos/comment
// @access  Private
const addComment = async (req, res) => {
    const { videoId, text } = req.body;
    const userId = req.user._id;

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const newComment = {
            userId,
            text,
            timestamp: new Date(),
        };

        video.comments.push(newComment);
        await video.save();

        // Populate the username for the newly added comment to return it
        const populatedVideo = await Video.findById(videoId).populate('comments.userId', 'username');
        const addedComment = populatedVideo.comments[populatedVideo.comments.length - 1];

        res.status(201).json({ message: 'Comment added', comment: addedComment });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error adding comment' });
    }
};

// @desc    Get user's uploaded videos
// @route   GET /api/videos/user/:userId
// @access  Public
const getUserVideos = async (req, res) => {
    try {
        const videos = await Video.find({ uploaderId: req.params.userId })
            .populate('uploaderId', 'username')
            .sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        console.error('Get user videos error:', error);
        res.status(500).json({ message: 'Server error fetching user videos' });
    }
};


module.exports = { upload, uploadVideo, getVideosFeed, likeUnlikeVideo, addComment, getUserVideos };