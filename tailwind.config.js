/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: {
          50: '#FAF8F4',
          100: '#F5F1EA',
          200: '#ECE7DF',
        },
        warmgrey: {
          100: '#E7E1D8',
          200: '#D6CEC2',
          300: '#B8AFA3',
          400: '#9A9186',
          600: '#635B52',
          800: '#35302B',
          900: '#23201D',
        },
        walnut: {
          400: '#8F6B54',
          600: '#6D4E3B',
          700: '#5C4030',
          900: '#352218',
        },
        champagne: {
          200: '#EFE0C4',
          300: '#DFC69B',
          400: '#C8A878',
          500: '#B08F5E',
          600: '#8C6E42',
        },
        dusk: {
          700: '#2A3548',
          800: '#1D2534',
          900: '#141B27',
          950: '#0E141D',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '"Noto Sans SC"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          'sans-serif',
        ],
        serif: [
          '"Cormorant Garamond"',
          '"Noto Serif SC"',
          'Georgia',
          'serif',
        ],
      },
      transitionTimingFunction: {
        architect: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
