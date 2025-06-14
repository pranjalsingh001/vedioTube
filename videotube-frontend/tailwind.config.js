/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./app/**/*.{ts,tsx,jsx,js}",
    "./components/**/*.{ts,tsx,jsx,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
