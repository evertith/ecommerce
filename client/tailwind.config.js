/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
        },
        secondary: {
          DEFAULT: '#6b7280',
          dark: '#4b5563',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
} 