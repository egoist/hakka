module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'body-bg': 'var(--body-bg)',
        'main-bg': 'var(--main-bg)',
        border: 'var(--border-color)',
        theme: `var(--theme-color)`,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
