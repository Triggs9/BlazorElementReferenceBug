﻿const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

module.exports = {
    target: "web",

    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".html"],
    },

    module: {
        
        rules: [
            // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
            { test: /.ts$/, loader: "ts-loader" },

            // All image files will be handled here
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },

            // All font files will be handled here
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader"
                    }
                ]
            },

            // All files with ".html" will be handled 
            { test: /\.html$/, loader: "html-loader" },

            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: ([
        // make sure we allow any jquery usages outside of our webpack modules
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        // Clean dist folder.
        new CleanWebpackPlugin(["./Pages","./wwwroot/js"], {
            "verbose": true // Write logs to console.
        }),

        // avoid publishing when compilation failed.
        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            filename: "../../Pages/Index.cshtml",
            template: "./Page_Templates/Index_Webpack_Template.cshtml"
        }),

        /* this does the same thing as new HtmlWebpackPlugin hash: true, just through asp.net
        new ScriptExtHtmlWebpackPlugin({
            custom: {
                test: /\.js$/,
                attribute: "asp-append-version",
                value: "true"
            }    
        })
        */
    ]),

    // pretty terminal output
    stats: { colors: true }
};