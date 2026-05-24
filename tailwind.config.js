/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#2563EB',      // Enterprise Blue
          secondary: '#60A5FA',    // Soft Light Blue
          glow: '#3B82F6',         // Glow Blue
          success: '#10B981',      // Cyber Green
          warning: '#F59E0B',      // Cyber Orange/Yellow
          danger: '#EF4444',       // Cyber Red
          darkBg: '#090D16',       // Deep Cyber Dark Background
          darkCard: '#111827',     // Dark Card
          darkBorder: '#1F2937',   // Dark Border
          lightBg: '#F8FAFC',      // Premium White/Gray Background
          lightCard: '#FFFFFF',    // Light Card
          lightBorder: '#E2E8F0',  // Light Border
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite alternate',
        'float-slow': 'float 8s ease-in-out infinite',
        'stream-slow': 'stream 20s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 8px rgba(37, 99, 235, 0.15), 0 0 15px rgba(37, 99, 235, 0.05)' },
          '100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.6), 0 0 35px rgba(96, 165, 250, 0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        stream: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
