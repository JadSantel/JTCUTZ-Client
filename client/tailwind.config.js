/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#eb5328',
          dark:   '#0a0a0a',
          card:   '#1a1a1a',
          border: '#2a2a2a',
          muted:  '#666666',
          light:  '#f5f5f5',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
    },
  },
  plugins: [],
};
