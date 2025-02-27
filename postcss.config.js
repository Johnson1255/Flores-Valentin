module.exports = {
  plugins: {
    'postcss-nested': {},
    autoprefixer: {},
    'postcss-import': {},
    'postcss-custom-properties': {
      preserve: true // Cambia a true para preservar las variables CSS
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false
  }
}