/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morandiPurple: {
          50: '#F6F4F8',
          100: '#EDE9F1',
          200: '#DCD3E3',
          300: '#CBBDD5',
          400: '#BAA7C7',
          500: '#A991B9',
          600: '#987BAB',
          700: '#87659D',
          800: '#764F8F',
          900: '#653981',
        },
      },
    },
  },
  plugins: [],
}