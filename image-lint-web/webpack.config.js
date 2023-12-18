import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import {VueLoaderPlugin} from 'vue-loader';
import packageJson from '../image-lint/package.json' assert {"type": "json"};
import {fileURLToPath} from 'url';

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
			'path': fileURLToPath(import.meta.resolve('path-browserify')),
			'crypto': fileURLToPath(import.meta.resolve('crypto-browserify')),
			'stream': fileURLToPath(import.meta.resolve('stream-browserify')),
			'buffer': fileURLToPath(import.meta.resolve('buffer/')),
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
			{
				test: /\.md$/i,
				use: [
					'vue-loader',
					{
						loader: fileURLToPath(import.meta.resolve('./html-to-vue-loader.js')),
						options: {
							className: 'docs-page',
							styleSheet: '../css/docs.css',
						}
					},
					{
						loader: fileURLToPath(import.meta.resolve('./remark-loader.js')),
						options: {},
					},
				],
			},
		],
	},
};

export default () => {
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
