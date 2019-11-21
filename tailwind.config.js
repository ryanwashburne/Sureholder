const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.blue[400],
          default: colors.blue[600],
          dark: colors.blue[800],
        },
        secondary: {
          light: colors.green[400],
          default: colors.green[600],
          dark: colors.green[800],
        },
      },
    },
  },
  variants: {},
  plugins: []
}
