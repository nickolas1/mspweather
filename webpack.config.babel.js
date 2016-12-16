import path from 'path'; // Join paths with the right type of slash
import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

let config = {
  entry: path.join(__dirname, 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile all .js files from ES6 to ES5
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: [
            ['es2015', { modules: false }],
            'stage-1'
          ],
          plugins: [
            'angular2-annotations',
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-flow-strip-types'
          ]
        }
      },
      {
        test: /\.css$/, // Use the style-loader for all .css files
        loaders: ['style', 'css']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   }
    // })
  ]
};

export default config;
