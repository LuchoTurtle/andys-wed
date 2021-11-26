const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: {
        app: path.resolve(__dirname, '../src/app.js'),
        notfound: path.resolve(__dirname, '../src/404.js'),
    },
    output:
        {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, '../dist')
        },
    resolve: {
        alias: {
            font: path.resolve(__dirname, '../static/font'),
        },
    },
    devtool: 'source-map',
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [
                    {from: path.resolve(__dirname, '../_headers')}
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: path.resolve(__dirname, '../static')}
                ]
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, '../src/index.html'),
                chunks: ['app'],
                minify: true
            }),
            new HtmlWebpackPlugin({
                filename: '404.html',
                template: path.resolve(__dirname, '../src/404.html'),
                chunks: ['notfound'],
                minify: true
            }),
            new MiniCSSExtractPlugin()
        ],
    module:
        {
            rules:
                [
                    // HTML
                    {
                        test: /\.(html)$/,
                        use: ['html-loader']
                    },

                    // JS
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use:
                            [
                                'babel-loader'
                            ]
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            // Creates `style` nodes from JS strings
                            "style-loader",
                            // Translates CSS into CommonJS
                            "css-loader",
                            // Compiles Sass to CSS
                            "sass-loader",
                        ],
                    },

                    // CSS
                    {
                        test: /\.css$/,
                        use:
                            [
                                MiniCSSExtractPlugin.loader,
                                'css-loader'
                            ]
                    },

                    // Images
                    {
                        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                        type: 'asset/resource',
                    },

                    // Fonts
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/i,
                        type: 'asset/resource',
                    },
                ]
        }
}
