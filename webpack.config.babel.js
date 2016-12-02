import path from 'path'; // Join paths with the right type of slash

let config = {
  entry: path.join(__dirname, 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, // Transpile all .js files from ES6 to ES5
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/, // Use the style-loader for all .css files
        loaders: ['style', 'css']
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, // Use the file-loader for fonts
        loaders: ['file-loader']
      }
    ]
  }
};

export default config;
