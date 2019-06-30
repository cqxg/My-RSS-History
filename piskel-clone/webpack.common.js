const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        app: './src/js/AppController/AppController'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: './src/js/gif.js-master/dist/gif.worker.js', to: "" },
            { from: './src/js/gif.js-master/dist/gif.worker.js.map', to: "" },
            { from: './src/js/gif.js-master/dist/gif.js.map', to: "" },
            { from: './src/js/gif.js-master/dist/gif.js', to: "" },
        ]),
        new HtmlWebpackPlugin({

            filename: 'index.html',
            template: './src/index.html'

        })
    ]
};
