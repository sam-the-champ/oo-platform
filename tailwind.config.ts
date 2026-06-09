/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          2: 'var(--bg2)',
          3: 'var(--bg3)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface2)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          2: 'var(--accent2)',
        },
        primary: 'var(--text)',
        secondary: 'var(--text2)',
        muted: 'var(--text3)',
        border: {
          DEFAULT: 'var(--border)',
          2: 'var(--border2)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-in': 'slideIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,229,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,229,255,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grad-1': 'linear-gradient(135deg, #00e5ff 0%, #a855f7 100%)',
        'grad-2': 'linear-gradient(135deg, #f5a623 0%, #ff4757 100%)',
        'grid-pattern': `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`,
      },
    },
  },
  plugins: [],
};
