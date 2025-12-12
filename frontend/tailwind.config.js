/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0a0e27',
          800: '#0f1432',
          700: '#151b3f',
          600: '#1a2147',
        },
        gunmetal: {
          800: '#1c1f2e',
          700: '#252836',
          600: '#2d3142',
          500: '#363a4f',
        },
        neon: {
          red: '#ff3864',
          orange: '#ff6b35',
          blue: '#00d9ff',
          purple: '#a855f7',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(255, 56, 100, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}
