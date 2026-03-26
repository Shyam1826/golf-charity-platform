/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        golf: {
          light: '#e8f5e9',
          DEFAULT: '#16a34a',
          dark: '#15803d',
          neon: '#39ff14',    // Energetic accent
        },
        darkblue: {
          DEFAULT: '#0f172a', // Clean, deep dark blue
          light: '#1e293b',
        },
        gold: {
          DEFAULT: '#fbbf24',
        }
      },
      boxShadow: {
        'neon': '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }
    },
  },
  plugins: [],
}
