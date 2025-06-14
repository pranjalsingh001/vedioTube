# VideoTube - My First Full-Stack Project

## 🌐 Overview
VideoTube is a full-stack video sharing platform built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to upload, view, like, and comment on videos. This was my first major full-stack project, and I also integrated ImageKit for efficient video hosting and delivery.

---

## 📂 Project Folder Structure

```
videotube/
├── videotube-backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── userController.js
│   │   └── videoController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── videoRoutes.js
│   ├── .env                    # Environment variables
│   └── server.js              # Main Express app
├── videotube-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── VideoCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Upload.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── .env                   # Frontend environment config
```

---

## ⚙️ Backend Technologies and Logic
- **Express.js**: Handles routing, middleware, and API structure.
- **MongoDB with Mongoose**: Schema-based NoSQL database for storing users, videos, comments, likes.
- **JWT Authentication**: Used to protect routes and manage user sessions.
- **Multer**: Middleware for handling file uploads.
- **ImageKit**: Used to store and deliver uploaded video URLs securely and quickly.

### Main Backend Functions:
- **Login/Signup**: Token generation and secure user management.
- **Video Upload**: Accepts files and uploads to ImageKit.
- **Like/Unlike Video**:
  ```js
  video.likes.includes(userId) ? remove userId : add userId
  ```
- **Add Comment**:
  ```js
  video.comments.push({ userId, text })
  ```

---

## 🖊️ Frontend Technologies and Logic
- **React.js** with React Router DOM for page navigation.
- **Axios** for REST API calls.
- **Tailwind CSS** for utility-first design.
- **Lucide-react**: For beautiful SVG icons.
- **Framer Motion**: For animations like hover/transition/slide effects.

### Core Components:

- **Navbar.jsx**
  - Renders based on `userInfo` in `localStorage`
  - Contains Login/Signup or Upload/Profile/Logout

- **VideoCard.jsx**
  - Displays each video with title, uploader, time, and stats
  - Like/Comment system:
    ```js
    const handleLike = async () => { axios.post(...); update state }
    const handleCommentSubmit = async () => { axios.post(...); update state }
    ```

### Lifting State:
In `Home.jsx`, likes and comments update global video state using:
```js
const handleCommentAdded = (videoId, newComment) => {
  setVideos(...)
}
```
```js
const handleLikeToggled = (videoId, newLikesCount, isLiked) => {
  setVideos(...)
}
```

---

## 🎨 UI Enhancements
- **Lucide-react** icons (Heart, MessageCircle)
- **Framer Motion** for:
  - Smooth appearing cards
  - Transitions on hover
  - Modal overlays
- **Tailwind UI** elements:
  - Gradient overlays on videos
  - Rounded buttons, responsive layout

---

## 🌟 What I Learned
- Setting up backend APIs
- Managing secure file upload pipelines
- Connecting frontend with backend using tokens
- Managing state updates cleanly with React
- Improving UX with animations and icons

---

## 🎓 Tech Stack Summary
- **Frontend**: React + TailwindCSS + Axios + Lucide + Framer Motion
- **Backend**: Node.js + Express + MongoDB + Multer + JWT
- **Media Hosting**: ImageKit.io

---

## ✨ Future Enhancements
- Add search and filter
- Add following system
- Video view counter and analytics
- Upload progress bar

---

This was my **first full-stack project**, and I’m excited to keep improving and building more complex systems!
