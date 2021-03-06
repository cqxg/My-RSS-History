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
            { from: './node_modules/gif.js.optimized/dist/gif.worker.js', to: "" },
            { from: './node_modules/gif.js.optimized/dist/gif.worker.js.map', to: "" },
            { from: './node_modules/gif.js.optimized/dist/gif.js.map', to: "" },
            { from: './node_modules/gif.js.optimized/dist/gif.js', to: "" },
        ]),
        new HtmlWebpackPlugin({

            filename: 'index.html',
            template: './src/index.html'

        })
    ]
};
