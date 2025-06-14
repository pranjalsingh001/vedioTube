/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { UserCircle2, Mail, CalendarDays, Video, Heart, MessageCircle } from "lucide-react" // Import icons
import { motion } from "framer-motion" 
import toast from "react-hot-toast" 
const ProfilePage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null)
  const [uploadedVideos, setUploadedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        toast.dismiss() // Clear any existing toasts
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        let fetchedUser = null

        if (userInfo && userInfo._id === userId) {
          fetchedUser = userInfo
        } else {
          // Fetch user details from backend if not current user
          const { data: userData } = await axios.get(`http://localhost:5000/api/users/${userId}`) // Assuming this endpoint exists
          fetchedUser = userData
        }
        setUserProfile(fetchedUser)

        // Fetch uploaded videos
        const { data: videosData } = await axios.get(`http://localhost:5000/api/videos/user/${userId}`)
        setUploadedVideos(videosData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching profile data:", err)
        const errorMessage =
          err.response && err.response.data.message ? err.response.data.message : "Failed to load profile data."
        setError(errorMessage)
        toast.error(errorMessage)
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [userId])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-white text-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"
        ></motion.div>
        <span className="ml-4">Loading profile...</span>
      </div>
    )
  if (error) return <div className="text-center text-red-500 mt-16 text-xl">{error}</div>
  if (!userProfile) return <div className="text-center text-white mt-16 text-xl">User not found.</div>

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-xl shadow-2xl mb-10 border border-gray-700 flex flex-col items-center"
      >
        <UserCircle2 className="w-24 h-24 text-indigo-400 mb-4" />
        <h2 className="text-4xl font-extrabold mb-3 text-white">@{userProfile.username || userProfile._id}</h2>
        {userProfile.email && (
          <p className="text-gray-300 mb-2 flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>{userProfile.email}</span>
          </p>
        )}
        {userProfile.createdAt && (
          <p className="text-gray-400 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5" />
            <span>Member since: {format(new Date(userProfile.createdAt), "PPP")}</span>
          </p>
        )}
      </motion.div>

      <h3 className="text-3xl font-bold mb-8 text-white text-center flex items-center justify-center space-x-3">
        <Video className="w-7 h-7 text-indigo-400" />
        <span>Uploaded Videos</span>
      </h3>
      {uploadedVideos.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">No videos uploaded by this user yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uploadedVideos.map((video) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 cursor-pointer"
            >
              <video src={video.videoUrl} controls className="w-full h-48 object-cover bg-black" />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white truncate mb-1">{video.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{video.likes.length}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{video.comments.length}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Uploaded {format(new Date(video.createdAt), "PPP")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePage
