/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e17',
        panel: '#0f1520',
        panelHeader: '#131b2a',
        border: '#1a2435',
        run: '#00e676',
        warn: '#ffab00',
        alarm: '#ff1744',
        info: '#00e5ff',
        accent: '#448aff',
        txt: '#e0e6f0',
        txtDim: '#6b7a94',
        txtMuted: '#3a4a60',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "'Courier New'", 'monospace'],
        sans: ["'IBM Plex Sans'", 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        scada: '4px',
      },
    },
  },
  plugins: [],
};
