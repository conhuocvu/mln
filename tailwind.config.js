/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        garden: {
          green: {
            50: '#E8F5E9',
            100: '#C8E6C9',
            200: '#A5D6A7',
            300: '#81C784',
            400: '#66BB6A',
            500: '#4CAF50',
            600: '#388E3C',
            700: '#2E7D32',
            800: '#1B5E20',
          },
          wood: {
            50: '#EFEBE9',
            100: '#D7CCC8',
            200: '#BCAAA4',
            300: '#A1887F',
            400: '#8D6E63',
            500: '#795548',
            600: '#6D4C41',
            700: '#5D4037',
            800: '#4E342E',
          },
          cream: {
            50: '#FAF8F5',
            100: '#F5EFEB',
            200: '#EDE4DC',
            300: '#E0D4C8',
          },
          pastel: {
            yellow: '#FFFDE7',
            blue: '#E3F2FD',
            pink: '#FCE4EC',
            purple: '#F3E5F5',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'wind-sway': 'sway 4s ease-in-out infinite alternate',
        'leaf-shake': 'shake 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'rain-fall': 'rain 0.8s linear infinite',
        'butterfly-fly': 'butterfly 4s ease-in-out infinite alternate',
      },
      keyframes: {
        sway: {
          '0%': { transform: 'rotate(-1deg)' },
          '100%': { transform: 'rotate(1deg)' },
        },
        shake: {
          '0%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(600px)' },
        },
        butterfly: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(15px, -15px) rotate(15deg)' },
          '100%': { transform: 'translate(-10px, -25px) rotate(-10deg)' },
        }
      }
    },
  },
  plugins: [],
}
