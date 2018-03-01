const fs = require('fs')
const debug = process.env.NODE_ENV !== "production"

const pathMap = fs
  .readdirSync('./pages')
  .filter(filename => filename.endsWith('.js'))
  .map(filename => filename ===  'index.js' ? '/' : ('/'+filename.slice(0, -3)))
  .reduce((acc, page) => (acc[page] = { page }, acc), {})

module.exports = {
  exportPathMap: () => pathMap,
  assetPrefix: '',
  // assetPrefix: !debug ? '/' : '', // for specific ghpages
  webpack: (config, { dev }) => {
    // Perform customizations to webpack config
    // console.log('webpack');
    // console.log(config.module.rules, dev);
    config.module.rules = config.module.rules.map(rule => {
      if (rule.loader === 'babel-loader') {
        rule.options.cacheDirectory = false
      }
      return rule
    })
    // Important: return the modified config
    return config
  }/*,
  webpackDevMiddleware: (config) => {
    // Perform customizations to webpack dev middleware config
    // console.log('webpackDevMiddleware');
    // console.log(config);
    // Important: return the modified config
    return config
  }, */
}
