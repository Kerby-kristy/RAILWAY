import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#84acff',
          400: '#5486ff',
          500: '#2f63f6',
          600: '#1f47d6',
          700: '#1a38ab',
          800: '#193189',
          900: '#182c6f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
