/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: {
            100: '#e8f5e9',
            500: '#4caf50',
            700: '#2e7d32',
            900: '#1b5e20',
          },
          lime: '#ccf381',
          dark: '#1a3c34',
          cream: '#f9f9f7',
          brown: '#4a403a',
          earth: '#795548',
          warning: '#ff9800',
          danger: '#f44336',
          white: '#ffffff',
          yellow: '#FDF0A8',
        },
        cream: '#FDFBF7',
        forest: {
          50: '#f2fdf4',
          800: '#1e3a2f',
          900: '#142820',
        },
        earth: '#A16207',
        soil: '#8D6E63',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}

