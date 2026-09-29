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
          dark: '#08090A',
          surface: '#0D0E10',
          card: '#111214',
          cardHover: '#171819',
          border: '#27272A',
          borderLight: '#3F3F46',
          primary: '#FF4D2E',
          primaryHover: '#E63D1E',
          primaryDark: '#CC3010',
          primarySubtle: 'rgba(255, 77, 46, 0.12)',
          muted: '#A1A1AA',
          dim: '#71717A',
          light: '#F5F5F5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
