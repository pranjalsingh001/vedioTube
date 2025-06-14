"use client"

// Content of VideoCard.jsx as previously provided
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle } from "lucide-react"

const VideoCard = ({ video, onCommentAdded, onLikeToggled }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(video.likes.length)
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(false)
  const videoRef = useRef(null)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const token = userInfo ? userInfo.token : null

  useEffect(() => {
    if (userInfo && video.likes.includes(userInfo._id)) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
    setLikesCount(video.likes.length)
  }, [video.likes, userInfo])

  const handleLike = async () => {
    if (!token) {
      alert("Please log in to like videos.")
      return
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.post("http://localhost:5000/api/videos/like", { videoId: video._id }, config)
      setIsLiked(!isLiked)
      setLikesCount(data.likesCount)
      onLikeToggled(video._id, data.likesCount, !isLiked) // Notify parent
    } catch (error) {
      console.error("Error liking/unliking video:", error)
      alert("Failed to like/unlike video.")
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      alert("Please log in to comment.")
      return
    }
    if (!commentText.trim()) return

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.post(
        "http://localhost:5000/api/videos/comment",
        { videoId: video._id, text: commentText },
        config,
      )
      setCommentText("")
      onCommentAdded(video._id, data.comment) // Notify parent to update comments
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment.")
    }
  }

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => console.log("Autoplay prevented:", error))
    }
  }

  const handleVideoPause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-8">
      <video
        ref={videoRef}
        className="w-full h-auto max-h-[80vh] object-contain bg-black"
        src={video.videoUrl}
        loop
        muted // Muted for autoplay
        playsInline
        controls
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
        <p className="text-sm text-gray-300">
          @{video.uploaderId.username} &middot; {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </p>
        <div className="flex items-center space-x-4 mt-2">
          <button onClick={handleLike} className="flex items-center space-x-1 text-sm">
            <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
            <span>{likesCount}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 text-sm">
            <MessageCircle className="w-5 h-5 text-white" />
            <span>{video.comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4 bg-gray-800 p-3 rounded-md max-h-40 overflow-y-auto">
            <h4 className="font-semibold mb-2">Comments</h4>
            {video.comments.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet.</p>
            ) : (
              video.comments.map((comment, index) => (
                <div key={index} className="mb-2 text-sm">
                  <span className="font-bold text-blue-300">@{comment.userId.username}:</span> {comment.text}
                </div>
              ))
            )}
            <form onSubmit={handleCommentSubmit} className="mt-3 flex">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow bg-gray-700 text-white px-3 py-1 rounded-l-md focus:outline-none"
              />
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-r-md">
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard
