const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const package = require('../image-lint/package.json');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';



const config = {
    entry: './web/js/index.js',
    devtool: isProduction ? 'source-map' : 'eval',
    output: {
        path: path.resolve(__dirname, '../docs'),
        filename: 'js/[name].[contenthash].js',
        clean: true
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
            '...'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: `${ package.name } - ${ package.version }`,
            meta: {
                description: package.description
            }
        }),
        new webpack.ProvidePlugin({ 
            Buffer: ['buffer', 'Buffer'] 
        }),
    ],
    resolve: {
    alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        fallback: {
            "path": require.resolve("path-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve('buffer/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash].css",
        }));
    } else {
        config.mode = 'development';
    }
    return config;
};
