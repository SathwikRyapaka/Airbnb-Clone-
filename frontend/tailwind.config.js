/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        airbnb: {
          light: '#FF5A5F',
          DEFAULT: '#FF385C',
          dark: '#E00B41',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'airbnb': '0 3px 10px rgba(0,0,0,0.1)',
        'airbnb-hover': '0 6px 20px rgba(0,0,0,0.15)',
        'card': '0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
