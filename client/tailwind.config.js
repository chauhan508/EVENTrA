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
          bg: '#06110D',
          dark: '#020605',
          surface: '#0B1712',
          surface2: '#101D17',
          surfaceHover: '#14251E',
          border: 'rgba(255, 255, 255, 0.10)',
          borderStrong: 'rgba(255, 255, 255, 0.18)',
          accent: '#C8FF00',
          accentHover: '#B5E600',
          accentSubtle: 'rgba(200, 255, 0, 0.12)',
          text: '#F5F7F4',
          muted: '#8F9B94',
          dim: '#5A6660'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
