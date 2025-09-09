const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      colors: {
        green1: '#05400A',
        green2: '#0E5814',
        green3: '#207227',
        green4: '#2F8132',
        green5: '#3F9142',
        green6: '#57AE5B',
        green7: '#7BC47F',
        green8: '#A3D9A5',
        green9: '#C1EAC5',
        green10: '#E3F9E5',
        grey1: '#222222',
        grey2: '#3B3B3B',
        grey3: '#515151',
        grey4: '#626262',
        grey5: '#7E7E7E',
        grey6: '#9E9E9E',
        grey7: '#B1B1B1',
        grey8: '#CFCFCF',
        grey9: '#E1E1E1',
        grey10: '#F7F7F7',
        red1: '#BA2525'
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/container-queries'),
  ]
}
