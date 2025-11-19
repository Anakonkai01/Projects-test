/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-blue":"#0e4ea2",
        "color-light-blue":"#0e4ea2",
        "color-light-yellow":"#f5c94c",
        "color-yellow":"#f5c94c",
        "color-red":"#ea2e0e",
      },
    },
  },
  plugins: [],
}

