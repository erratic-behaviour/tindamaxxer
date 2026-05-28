/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // <-- THIS IS THE EXACT FIX FOR THAT ERROR
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}