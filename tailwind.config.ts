import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        // Токены подключаются через CSS-переменные (assets/css/themes.css)
        // bg/fg — триплеты, поддерживают alpha-модификаторы (text-fg/90)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'var(--muted)',
        card: 'var(--card)',
        border: 'var(--border)',
        accent: 'var(--accent-from)',
        'accent-from': 'var(--accent-from)',
        'accent-to': 'var(--accent-to)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '720px',
        wide: '960px',
        wider: '1140px',
      },
    },
  },
  plugins: [],
}
