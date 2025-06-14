"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import VideoCard from "../components/VideoCard"
import toast from "react-hot-toast"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"


const HomePage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("http://localhost:5000/api/videos/feed")
      setVideos(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching videos:", err)
      setError("Failed to load videos. Please try again later.")
      setLoading(false)
      toast.error("Failed to load videos.")
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // Intersection Observer for auto-play and pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target.querySelector("video")
          if (videoElement) {
            if (entry.isIntersecting) {
              videoElement.play().catch((e) => console.log("Autoplay prevented:", e))
            } else {
              videoElement.pause()
            }
          }
        })
      },
      { threshold: 0.7 }, // Trigger when 70% of the video is visible
    )

    // Observe each video card's container
    if (containerRef.current) {
      Array.from(containerRef.current.children).forEach((child) => {
        observer.observe(child)
      })
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        Array.from(containerRef.current.children).forEach((child) => {
          observer.unobserve(child)
        })
      }
    }
  }, [videos]) 

  const handleCommentAdded = (videoId, newComment) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video._id === videoId ? { ...video, comments: [...video.comments, newComment] } : video,
      ),
    )
  }

  const handleLikeToggled = (videoId, newLikesCount, isLiked) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video._id === videoId
          ? {
              ...video,
              likes: isLiked
                ? [...video.likes, JSON.parse(localStorage.getItem("userInfo"))._id]
                : video.likes.filter((id) => id !== JSON.parse(localStorage.getItem("userInfo"))._id),
            }
          : video,
      ),
    )
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-white text-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"
        ></motion.div>
        <span className="ml-4">Loading videos...</span>
      </div>
    )
  if (error) return <div className="text-center text-red-500 mt-16 text-xl">{error}</div>
  if (videos.length === 0)
    return <div className="text-center text-white mt-16 text-xl">No videos uploaded yet. Be the first to upload!</div>

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center h-[calc(100vh-80px)] overflow-y-scroll scroll-snap-y-mandatory"
    >
      {videos.map((video) => (
        <div key={video._id} className="w-full flex-shrink-0 scroll-snap-start flex justify-center items-center py-4">
          <VideoCard video={video} onCommentAdded={handleCommentAdded} onLikeToggled={handleLikeToggled} />
        </div>
      ))}
    </div>
  )
}

export default HomePage
