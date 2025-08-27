/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        accent: "#facc15",
        neutral: {
          light: "#f3f4f6",
          DEFAULT: "#6b7280",
          dark: "#374151",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
