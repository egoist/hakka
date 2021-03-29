import { defineConfig } from 'windicss-webpack-plugin'

export default defineConfig({
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'body-bg': 'var(--body-bg)',
        'body-bg-lighter': 'var(--body-bg-lighter)',
        'main-bg': 'var(--main-bg)',
        border: 'var(--border-color)',
        theme: `var(--theme-color)`,
        fg: `var(--fg)`,
        'fg-light': `var(--fg-light)`,
      },
    },
  },
})
