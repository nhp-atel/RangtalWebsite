/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B132B',
          900: '#06091A',
          800: '#0B132B',
          700: '#131E45',
          600: '#1B2A5E',
        },
        maroon: {
          DEFAULT: '#7B1E3A',
          700: '#5C162B',
          600: '#7B1E3A',
          500: '#9B2A4C',
        },
        royal: {
          DEFAULT: '#5A189A',
          700: '#3E1071',
          600: '#5A189A',
          500: '#7B2CBF',
        },
        gold: {
          DEFAULT: '#F4B942',
          400: '#FFD27A',
          500: '#F4B942',
          600: '#D99A22',
        },
        marigold: {
          DEFAULT: '#F77F00',
          500: '#F77F00',
          600: '#D96B00',
        },
        cream: {
          DEFAULT: '#FFF8E7',
          50: '#FFFCF3',
          100: '#FFF8E7',
        },
        pinkglow: '#FF4D8D',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        devanagari: ['"Yatra One"', 'serif'],
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(244,185,66,0.35), transparent 60%)',
        'radial-maroon': 'radial-gradient(circle at 100% 100%, rgba(123,30,58,0.6), transparent 60%)',
        'spotlight': 'radial-gradient(ellipse at center, rgba(244,185,66,0.18), transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.08)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        'pulse-glow': 'pulse-glow 3.4s ease-in-out infinite',
        'marquee': 'marquee 36s linear infinite',
      },
      boxShadow: {
        'glow-gold': '0 0 40px rgba(244,185,66,0.35)',
        'glow-maroon': '0 0 80px rgba(123,30,58,0.45)',
        'inner-warm': 'inset 0 1px 0 rgba(255,248,231,0.08)',
      },
    },
  },
  plugins: [],
}
