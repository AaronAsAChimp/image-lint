import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import {VueLoaderPlugin} from 'vue-loader';
// import packageJson from '../image-lint/package.json';
import {fileURLToPath} from 'url';
import {readFile} from 'fs/promises';

const isProduction = process.env.NODE_ENV == 'production';
const packageJson = JSON.parse(await readFile(fileURLToPath(import.meta.resolve('../image-lint/package.json'))));


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DOCS_DIR = path.resolve(__dirname, '../docs');

const config = {
	entry: './web/js/index.js',
	devtool: isProduction ? 'source-map' : 'eval',
	output: {
		path: DOCS_DIR,
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
		new webpack.EnvironmentPlugin({
			'BASE_PATH': '/',
		}),
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
		new CopyPlugin({
			patterns: [
				{
					from: 'web/404.html',
					to: DOCS_DIR,
				},
			],
		}),
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
						},
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
