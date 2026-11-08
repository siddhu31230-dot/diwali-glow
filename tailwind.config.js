/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          dark: '#06010d',
          darker: '#030007',
          plum: '#110324',
          violet: '#1c083a',
          purple: '#2b0b55',
          gold: '#fcd34d',
          goldLight: '#fef08a',
          goldDark: '#b45309',
          amber: '#f59e0b',
          crimson: '#991b1b',
          marigold: '#ff7b00',
          marigoldYellow: '#ffbe0b',
        }
      },
      fontFamily: {
        serif: ['"Cinzel Decorative"', '"Playfair Display"', 'Cormorant Garamond', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        festive: ['"Rozha One"', '"Cinzel"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(251, 191, 36, 0.4)',
        'glow-md': '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(245, 158, 11, 0.3)',
        'glow-lg': '0 0 50px rgba(251, 191, 36, 0.8), 0 0 100px rgba(245, 158, 11, 0.5), 0 0 140px rgba(217, 119, 6, 0.3)',
        'glow-flame': '0 0 25px #ffedd5, 0 0 50px #fbbf24, 0 0 90px #ea580c, 0 0 130px #7c2d12',
      },
      animation: {
        'flicker': 'flicker 2.5s infinite ease-in-out',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-very-slow': 'spin 35s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) skewX(0deg)', opacity: '1' },
          '25%': { transform: 'scale(1.04, 0.96) skewX(-1.5deg)', opacity: '0.94' },
          '50%': { transform: 'scale(0.97, 1.05) skewX(2deg)', opacity: '1' },
          '75%': { transform: 'scale(1.02, 0.99) skewX(-1deg)', opacity: '0.96' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        }
      }
    },
  },
  plugins: [],
}
