const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[name].[ext]'
                    }
                }
            }
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8080,
        proxy: {
            '/socket/*': {
                target: process.env.REACT_APP_SOCKET_SERVER + "/socket.io",
                changeOrigin: true,
                pathRewrite: {'^/socket': ''},
                ws: true
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed)
        })
    ]
});
