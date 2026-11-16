/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        powder: {
          light: '#BBD8FB',
          DEFAULT: '#8DB9F0',
          hover: '#7AAEEA',
          dark: '#5891D8',
          deep: '#346EB5',
        },
        lavender: {
          50: '#FBFBFE',
          100: '#F4F3FC',
          200: '#E9E8F8',
          300: '#D5D3F2',
          DEFAULT: '#E9E8F8',
          dark: '#C2BFEE',
        },
        peach: {
          light: '#FCE6DE',
          DEFAULT: '#F5B69E',
          hover: '#EFA488',
          dark: '#E28664',
          deep: '#C9623C',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(141, 185, 240, 0.15), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(141, 185, 240, 0.12), 0 4px 8px -2px rgba(245, 182, 158, 0.08)',
        'float': '0 20px 40px -10px rgba(71, 110, 181, 0.22)',
      },
    },
  },
  plugins: [],
}
