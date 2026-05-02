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
          navy: '#001a36',
          'navy-deep': '#000d1c',
          'navy-soft': '#002a5c',
          gold: '#C9920A',
          'gold-soft': '#fffbf0',
          page: '#F5F6FA',
          line: '#e8eaef',
          muted: '#9aa0a6',
        },
        success: {
          DEFAULT: '#1a7a4a',
          bg: '#eaf7ef',
        },
        warning: {
          DEFAULT: '#a87100',
          bg: '#fef4e0',
        },
        error: {
          DEFAULT: '#c0392b',
          bg: '#fde8e6',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
