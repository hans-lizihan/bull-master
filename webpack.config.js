const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV,
  bail: true,
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',

  entry: ['./client/index.jsx'],
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    hot: true,
    quiet: false,
    contentBase: path.join(__dirname, '../static'),
    publicPath: '/ui',
    stats: {
      colors: true,
      modules: false,
    },
    watchOptions: {
      ignored: /(node_modules)/,
    },
    disableHostCheck: true,
    proxy: {
      '/': `http://localhost:${4889}`,
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
     process.env.NODE_ENV === 'development' ? new webpack.HotModuleReplacementPlugin() : null,
     new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  }
}
