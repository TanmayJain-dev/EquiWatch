/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#e4e7eb',
          200: '#cbd2d9',
          300: '#9aa5b1',
          400: '#52667a',
          500: '#314457',
          600: '#253646',
          700: '#1b2733',
          800: '#131c25',
          900: '#0c1218',
        },
        primary: {
          DEFAULT: '#1e293b', // Deep Slate
          light: '#334155',
          dark: '#0f172a'
        },
        accent: {
          DEFAULT: '#2563eb', // Royal Blue
          hover: '#1d4ed8',
          light: '#dbeafe'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
