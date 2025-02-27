module.exports = {
    plugins: {
      'postcss-nested': {},
      autoprefixer: {},
      'postcss-import': {},
      'postcss-custom-properties': {
        preserve: false // No preserva las variables CSS originales
      },
      'cssnano': process.env.NODE_ENV === 'production' ? {} : false
    }
  }