const tailwindConfig = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#020408',
        foreground: '#ffffff',
        panel: 'rgba(10, 15, 26, 0.8)',
        primary: '#00d2ff',
        accent: '#ff0055',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-rajdhani)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
};

export default tailwindConfig;
