// you need to restart dev server for changes to take effect
//  if changes are made to webpack config file while dev server is running.
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "development",

  // Without following option, source code in inspect option will not be untouched
  //  source code. So will be harder to debug. Plus If we don’t do this, any error
  //  messages we get won’t necessarily match up to the correct files and line numbers
  //  from our development code
  devtool: "eval-source-map",
  // As html is not js, so dev server will not restart on changes made to it. So,
  // adding it to watch list of dev server:
  devServer: {
    watchFiles: ["./src/template.html"],
  },
});
