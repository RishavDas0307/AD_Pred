/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#faf8ff',
          dim: '#d2d9f4',
          bright: '#faf8ff',
          container: '#eaedff',
          'container-lowest': '#ffffff',
          'container-low': '#f2f3ff',
          'container-high': '#e2e7ff',
          'container-highest': '#dae2fd',
          variant: '#dae2fd'
        },
        primary: {
          DEFAULT: '#0058be',
          container: '#2170e4',
          dark: '#004395',
          light: '#d8e2ff',
          fixed: '#d8e2ff',
          'fixed-dim': '#adc6ff'
        },
        secondary: {
          DEFAULT: '#6b38d4',
          container: '#8455ef',
          light: '#e9ddff',
          dark: '#5516be'
        },
        tertiary: {
          DEFAULT: '#00685d',
          container: '#008376',
          light: '#71f8e4',
          dark: '#005048'
        },
        charcoal: {
          DEFAULT: '#131b2e',
          variant: '#424754',
          muted: '#727785',
          border: '#e2e7ff'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(19, 27, 46, 0.04), 0 2px 6px -1px rgba(19, 27, 46, 0.02)',
        'card-hover': '0 10px 25px -3px rgba(0, 88, 190, 0.08), 0 4px 10px -2px rgba(19, 27, 46, 0.03)',
        'glow-primary': '0 0 20px -3px rgba(0, 88, 190, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}