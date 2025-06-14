"use client"
import { Link, useNavigate } from "react-router-dom"
import { Upload, User, LogIn, UserPlus, LogOut, Youtube } from "lucide-react" 
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"


const Navbar = () => {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/login")
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-gray-900 p-4 shadow-lg border-b border-gray-700 sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold tracking-tight flex items-center space-x-2">
          <motion.div whileHover={{ rotate: 10, scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Youtube className="w-8 h-8 text-indigo-500" />
          </motion.div>
          <span>VideoTube</span>
        </Link>
        <div className="flex items-center space-x-6">
          {userInfo ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/upload"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  <Upload className="w-5 h-5" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/profile/${userInfo._id}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </motion.div>
              <motion.button
                onClick={logoutHandler}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
