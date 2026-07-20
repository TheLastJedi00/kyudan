/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Superfícies e tipografia (tematizáveis via CSS vars — light/dark)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted: 'rgb(var(--surface-2) / <alpha-value>)',
        },
        line: 'rgb(var(--border) / <alpha-value>)',
        fg: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          muted: 'rgb(var(--fg-muted) / <alpha-value>)',
          subtle: 'rgb(var(--fg-subtle) / <alpha-value>)',
        },
        // Linhagem de faixas FCK/CBK — linguagem visual primária (fixa nos dois temas)
        belt: {
          white: '#E7E5E4',
          yellow: '#EAB308',
          red: '#DC2626',
          orange: '#EA580C',
          green: '#16A34A',
          purple: '#7C3AED',
          brown: '#92400E',
          black: '#0A0A0A',
        },
      },
      borderColor: {
        DEFAULT: 'rgb(var(--border) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      minHeight: {
        touch: '48px', // Fat-finger design (mín. 48dp)
      },
      minWidth: {
        touch: '48px',
      },
    },
  },
  plugins: [],
};
