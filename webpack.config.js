const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Add mutiple page in pages array
const pages = ["index", "about-us", "contact-us"];

module.exports = {
    target: 'web',

    mode: 'development',

    devServer: {
        devMiddleware: {
            publicPath: join(__dirname, 'build'),
            writeToDisk: true,
        },
        hot: false,
        port: '8989',
        proxy: {
            '/': {
                // htdocs folder namer must be mentioned here in place of "webpack-php-setup"
                target: `http://localhost/webpack-php-setup/dist`,
            },
        },
        static: false,
        watchFiles: ['src/**/*.*', 'app/**/*.*'],
    },

    entry: pages.reduce((config, page) => {
        config[page] = `./src/${page}.js`;
        return config;
    }, {}),

    // https://webpack.js.org/concepts/output/
    output: {
        filename: "[name].js",
        path: join(__dirname, "dist/"),
        // clean: true,
    },

    // https://webpack.js.org/configuration/optimization/
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Creates `style` nodes from JS strings
                    // "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "./styles/[name].[contenthash].css",
            chunkFilename: "./styles/[id].[contenthash].css",
        }),
    ].concat(
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./${page}/index.php`,
                    filename: `${page}.php`,
                    chunks: [page],
                })
        )
    )
};