const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const packageJson = require('../image-lint/package.json');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';


const config = {
	entry: './web/js/index.js',
	devtool: isProduction ? 'source-map' : 'eval',
	output: {
		path: path.resolve(__dirname, '../docs'),
		filename: 'js/[name].[contenthash].js',
		clean: true,
	},
	devServer: {
		open: true,
		host: 'localhost',
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
		minimizer: [
			new CssMinimizerPlugin(),
			'...',
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: `${ packageJson.name } - ${ packageJson.version }`,
			meta: {
				description: packageJson.description,
			},
		}),
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
		}),
		new VueLoaderPlugin(),
	],
	resolve: {
		alias: {
			// 'vue$': 'vue/dist/vue.esm-bundler.js'
		},
		fallback: {
			'path': require.resolve('path-browserify'),
			'crypto': require.resolve('crypto-browserify'),
			'stream': require.resolve('stream-browserify'),
			'buffer': require.resolve('buffer/'),
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [stylesHandler, 'css-loader'],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: 'asset',
			},
			{
				test: /\.vue$/i,
				loader: 'vue-loader',
			},
		],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = 'production';

		config.plugins.push(new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
		}));
	} else {
		config.mode = 'development';
	}
	return config;
};
