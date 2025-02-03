// you need to restart dev server for changes to take effect
//  if changes are made to webpack config file while dev server is running.
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "production",
});
