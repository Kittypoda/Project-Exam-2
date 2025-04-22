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

