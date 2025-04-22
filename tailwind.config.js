/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Racing Sans One"', 'sans-serif'],
        alexandria: ['"Alexandria", sans-serif'], 
      },
      fontSize: {
        h1: ['40px', { lineHeight: '1.2' }],
        'h1-mobile': ['20px', { lineHeight: '1.3' }],
        h2: ['20px', { lineHeight: '1.3' }],
      },
      colors: {
        dustygreen: '#76A79F',
        mintgreen: '#ECF4F3',
        blackish: '#343434',
        lightgray: '#FAFAFA',
      },
    },
  },
  plugins: [],
}

