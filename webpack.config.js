var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
module.exports = {
    devtool:'source-map',
    entry:{
        "/js/bundle.js":path.resolve(__dirname ,'react/index.react.js')
    },
    output:{
        path: path.resolve(__dirname ,'build'),
        filename: "[name]"
    },

    module:{
        loaders:[
            {
                test:/\.json$/,
                loader:'json'
            },
            {
                test:/.\js$/,
                exclude:/node_modules/,
                loader:'babel',
                query: {
                  presets: ['react', 'es2015'], //设定babel的转码规则
                  "plugins": [
                    ["import", { libraryName: "antd", "style": "css" }] // `style: true` 会加载 less 文件
                  ]
                }
            },
            {
                test:/\.css$/,
                loader:'style!css'
            },
            {
                test:/\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?modules&importLoaders=1&localIdentName=[local]--[hash:base64:5]&-url&sourceMap!less?sourceMap')
            }
        ]
    },
    watch:true,
    postcss:[
        require('autoprefixer')
    ],

    plugins:[
        new webpack.BannerPlugin("write by dogLin"),
        new HtmlWebpackPlugin({
            template:__dirname + '/app/index.tmpl.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("/css/styles.css")
    ],


    devServer:{
        colors:true,
        historyApiFallback:true,
        inline:true,
        hot:true
    }
}
