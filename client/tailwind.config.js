/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Standard Luxury" (iOS Blue/Indigo)
        uni: '#4F46E5',       // Indigo-600 (Primary Brand)
        uniDark: '#312E81',   // Indigo-900 (Text/Contrast)
        uniLight: '#818CF8',  // Indigo-400 (Accents)
        cream: '#F9FAFB',     // Gray-50 (Apple-style background)
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)', // Soft glass shadow
        'glass-sm': '0 4px 10px 0 rgba(31, 38, 135, 0.05)',
        '3d': '0 10px 20px rgba(0,0,0,0.05), 0 6px 6px rgba(0,0,0,0.05)', // Depth
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}