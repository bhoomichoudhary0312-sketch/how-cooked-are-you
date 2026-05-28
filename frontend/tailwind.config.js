/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: '#ff4d4d',
        warning: '#ffcc00',
        safe: '#00ff99',
      }
    },
  },
  plugins: [],
}