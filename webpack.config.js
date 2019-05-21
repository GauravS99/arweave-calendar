
let HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});

module.exports = {
	mode: 'development',
	entry: __dirname + '/app/index.js',
	optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
	module: {
		rules:[
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use:{
					loader: 'babel-loader'
				}
			},
   			{
   				 test: /\.css$/,
 				 use: 
 				[
 				 	{
 				 		loader: MiniCssExtractPlugin.loader
 				 	},
    				{
      					loader: 'css-loader',
      					options: {
       						modules: true,
        					localIdentName: '[path][name]__[local]--[hash:base64:5]'
      					}
    				}
  				]
   			},
        {
          test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
              }]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
              }]
        }
		]
	},
	output: {
		filename: 'transformed.js',
		path: __dirname + '/build'
	},
	plugins: [HTMLWebpackPluginConfig, new MiniCssExtractPlugin({
      filename: "[name].css",
    })]
};