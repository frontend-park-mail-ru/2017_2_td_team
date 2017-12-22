const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './assets/js/app.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'www')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(css|styl)$/,
                use: ExtractTextPlugin.extract(['css-loader', 'stylus-loader'])
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'assets/js'),
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 4,
                            workerParallelJobs: 50,
                        }
                    },
                    'babel-loader',
                ]
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new UglifyJsPlugin({
            parallel: 4,
            cache: true,
            sourceMap: true,
        }),
        new CompressionPlugin({
            deleteOriginalAssets: true
        }),
    ],
};


