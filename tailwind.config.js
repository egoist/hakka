module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--app-bg)',
        border: 'var(--border-color)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
