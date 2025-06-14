"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UploadCloud, Video, FileText, Loader2 } from "lucide-react" // Import icons
import toast from "react-hot-toast" 
// eslint-disable-next-line
import { motion } from "framer-motion"


const UploadPage = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("") // Added description field
  const [videoFile, setVideoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (!userInfo) {
      navigate("/login") // Redirect to login if not authenticated
    }
  }, [navigate])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100 MB limit
        toast.error("File size exceeds 100MB limit.")
        setVideoFile(null)
        setPreviewUrl("")
        return
      }
      setVideoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      toast.dismiss() // Clear any existing errors
    } else {
      setVideoFile(null)
      setPreviewUrl("")
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    toast.dismiss() // Clear any existing toasts

    if (!title || !videoFile) {
      toast.error("Please provide a title and select a video file.")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description) // Append description
    formData.append("video", videoFile)

    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    const token = userInfo ? userInfo.token : null

    if (!token) {
      toast.error("You must be logged in to upload videos.")
      return
    }

    setUploading(true)
    const uploadToastId = toast.loading("Uploading video...")

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.post("http://localhost:5000/api/videos/upload", formData, config)
      toast.success("Video uploaded successfully!", { id: uploadToastId })
      setTitle("")
      setDescription("")
      setVideoFile(null)
      setPreviewUrl("")
      setTimeout(() => navigate("/"), 2000)
    } catch (err) {
      console.error("Upload error:", err)
      const errorMessage =
        err.response && err.response.data.message ? err.response.data.message : "Video upload failed."
      toast.error(errorMessage, { id: uploadToastId })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center flex items-center justify-center space-x-3">
          <UploadCloud className="w-9 h-9 text-indigo-400" />
          <span>Upload New Video</span>
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-300 text-sm font-semibold mb-2">
              Video Title
            </label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="title"
                className="w-full pl-10 pr-5 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-300 text-sm font-semibold mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="description"
                rows="3"
                className="w-full pl-10 pr-5 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-y"
                placeholder="Tell us about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div>
            <label htmlFor="videoFile" className="block text-gray-300 text-sm font-semibold mb-2">
              Select Video File
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/mp4,video/mov,video/webm"
              className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 file:transition-colors file:duration-200 cursor-pointer"
              onChange={handleFileChange}
              required
            />
          </div>
          {previewUrl && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-white text-sm font-bold mb-3 flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Video Preview:</span>
              </h3>
              <video src={previewUrl} controls className="w-full h-auto max-h-64 rounded-md border border-gray-500" />
            </div>
          )}
          <motion.button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            <span>{uploading ? "Uploading..." : "Upload Video"}</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default UploadPage
