const path = require('path');
const webpack = require('webpack');

const config = {
	entry: path.resolve(__dirname, './src/app.js'),
	output: {
		path: path.resolve(__dirname, '../static/react/'),
		filename: 'hermes.js',
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				include: path.resolve(__dirname),
			},
			{
				test: /\.html$/,
				use: ['cache-loader', 'html-loader']
			},
			{
				test: /\.css$/,
				use: [
					'cache-loader',
					'style-loader',
					'postcss-loader',
				],
			},
			{
				test: /\.(jpe?g|png|gif|eot|woff|woff2|svg|ttf)([\?]?.*)$/i,
				use: ['cache-loader', {
					loader: 'url-loader',
					options: {
						limit: '100000'
					}
				}],
			}
		]
	},
	resolve: {
    modules: [path.resolve(__dirname, '../node_modules')],
		extensions: ['.js', '.json', '.scss', '.ts']
	}
};

// config.devtool = 'eval-source-map';

module.exports = config;
