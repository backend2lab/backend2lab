/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/client/index.html",
    "./apps/client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tactical Operations Design System Colors
        tactical: {
          primary: '#3b82f6', // blue-500 - Primary brand color (reduced orange)
          accent: '#10b981', // emerald-500 - Accent color for highlights
          highlight: '#8b5cf6', // violet-500 - Highlight color for special elements
          background: '#000000', // black - Main background
          surface: '#171717', // neutral-900 - Card backgrounds
          'text-primary': '#ffffff', // white - Primary text
          'text-secondary': '#737373', // neutral-500 - Secondary text
          'border-primary': '#404040', // neutral-700 - Card borders
          'border-secondary': '#262626', // neutral-800 - Subtle separators
          success: '#10b981', // emerald-500 - Success states
          warning: '#f59e0b', // amber-500 - Warning states
          error: '#ef4444', // red-500 - Error states
        },
        // Legacy colors for backward compatibility
        dark: {
          card: '#171717',
          'card-hover': '#262626',
          tertiary: '#404040',
          'border-primary': '#404040',
          'border-secondary': '#262626',
          'text-primary': '#ffffff',
          'text-secondary': '#737373',
          'text-tertiary': '#525252',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Updated to tactical primary (blue)
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        'tactical': ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        'primary': ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        'mono': ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'tactical': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'tactical-lg': '0 8px 25px rgba(0, 0, 0, 0.6)',
        'soft': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'large': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'xl': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'dark': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 8px 25px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tactical-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '70': '280px', // Sidebar expanded width
      },
    },
  },
  plugins: [],
}
