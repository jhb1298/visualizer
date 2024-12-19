/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
      }
    },
  },
  plugins: [
  ],
}

