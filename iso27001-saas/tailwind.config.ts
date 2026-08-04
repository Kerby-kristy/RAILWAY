import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#2e2a85',
          950: '#1e1b4b',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dde1e8',
          300: '#c3c9d4',
          400: '#98a1b3',
          500: '#717c92',
          600: '#545e74',
          700: '#3f4759',
          800: '#282e3c',
          900: '#161a24',
          950: '#0b0d13',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faedc4',
          200: '#f5da88',
          300: '#eec24b',
          400: '#e6ac28',
          500: '#d3931a',
          600: '#b17313',
          700: '#8c5714',
          800: '#734617',
          900: '#603b18',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 6px -1px rgb(15 23 42 / 0.06)',
        elevated: '0 8px 24px -8px rgb(30 27 75 / 0.18), 0 2px 8px -2px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
