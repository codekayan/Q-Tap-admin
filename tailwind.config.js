/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure Tailwind scans all your components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E57C00", // matches your MUI theme
      },
    },
  },
  plugins: [],
}
