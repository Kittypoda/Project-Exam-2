// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Racing Sans One"', 'sans-serif'],
        alexandria: ['"Alexandria", sans-serif'],
      },
      fontSize: {
        h1: ['30px', { lineHeight: '1.2' }],
        'h1-mobile': ['20px', { lineHeight: '1.3' }],
        h2: ['20px', { lineHeight: '1.3' }],
      },
      colors: {
        dustygreen: '#76A79F',
        mintgreen: '#ECF4F3',
        blackish: '#343434',
        lightgray: '#FAFAFA',
        overlaygreen: '#123F45',
        deletered: '#B93127',
      },
      animation: {
        'float-x': 'floatX 15s ease-in-out infinite',
      },
      keyframes: {
        floatX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-20px)' },
        },
      },
      borderRadius: {
        '40px': '40px',
      },
    },
  },
  plugins: [],
};
