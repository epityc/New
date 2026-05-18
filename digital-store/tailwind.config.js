/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50:  '#FFF0F7',
          100: '#FFD6EA',
          200: '#FFB3D4',
          300: '#FF8FB8',
          400: '#FF6B9D',
          500: '#FF4785',
          600: '#E0336E',
          700: '#B82258',
          800: '#8F1544',
          900: '#660C32',
        },
        violet: {
          50:  '#F5F0FF',
          100: '#EDE0FF',
          200: '#D9BFFF',
          300: '#C084FC',
          400: '#A855F7',
          500: '#9333EA',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #FFF0F7 0%, #EDE0FF 50%, #FFD6EA 100%)',
        'card-gradient': 'linear-gradient(145deg, #ffffff 0%, #FFF0F7 100%)',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(255, 107, 157, 0.15)',
        'glow': '0 0 40px rgba(168, 85, 247, 0.2)',
        'card': '0 8px 32px rgba(155, 89, 182, 0.12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
