module.exports = {
  plugins: {
    'postcss-nested': {},
    autoprefixer: {},
    'postcss-import': {},
    'postcss-custom-properties': {
      preserve: true
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false
  }
}