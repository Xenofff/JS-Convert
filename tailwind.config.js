/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './components/*.js',
    './*/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#4f46e5',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
