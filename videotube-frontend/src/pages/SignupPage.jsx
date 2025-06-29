"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { User, Mail, Lock, UserPlus } from "lucide-react" 
import toast from "react-hot-toast" 
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion" 


const SignupPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      navigate("/") // Redirect to home if already logged in
    }
  }, [navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    toast.dismiss() // Clear any existing toasts

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", { username, email, password }, config)
      localStorage.setItem("userInfo", JSON.stringify(data))
      toast.success("Account created successfully!")
      navigate("/")
    } catch (err) {
      const errorMessage =
        err.response && err.response.data.message ? err.response.data.message : "Signup failed. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
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
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Join VideoTube!</h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-semibold mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="username"
                className="w-full pl-10 pr-5 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-5 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-5 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="confirmPassword"
                className="w-full pl-10 pr-5 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-5 h-5 border-2 border-t-2 border-white border-solid rounded-full"
              ></motion.div>
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            <span>{loading ? "Signing Up..." : "Sign Up"}</span>
          </motion.button>
        </form>
        <p className="text-center text-gray-400 text-md mt-6">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-indigo-400 hover:underline font-medium">
            Login
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default SignupPage
