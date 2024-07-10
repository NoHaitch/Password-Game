/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: { 
          "title": ["Permanent Marker", 'sans-serif'], 
          "normal": ["Poppins", 'sans-serif'] 
      } 
  },
  },
  plugins: [],
}