var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
var CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义函数判断是否是在当前生产环境，这个很重要，一位开发环境和生产环境配置上有一些区别
var isProduction = function () {
     // console.log(process.env.NODE_ENV == 'production');
  if(process.env.NODE_ENV){
    console.log(process.env.NODE_ENV == 'production');
  }
  // return process.env.NODE_ENV == 'production';
  return process.env.NODE_ENV;

};
var plugins = [
    new webpack.BannerPlugin("write by dogLin"),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("css/styles.css"),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        minChunks: Infinity,
    }),
    new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt'),
    new HtmlWebpackPlugin({
            template:__dirname + '/app/index.tmpl.html',
            inject: true, // 自动注入
            minify: {
                removeComments: true,        //去注释
                collapseWhitespace: true,    //压缩空格
                removeAttributeQuotes: true  //去除属性引用
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            //必须通过上面的 CommonsChunkPlugin 的依赖关系自动添加 js，css 等
            chunksSortMode: 'dependency'
        }),
    // new CompressionWebpackPlugin({ //gzip 压缩
    //     asset: '[path].gz[query]',
    //     algorithm: 'gzip',
    //     test: new RegExp(
    //         '.(js|less|css)$'    //压缩 js 与 css,less
    //     ),
    //     threshold: 10240,
    //     minRatio: 0.8
    // }),

]

if( isProduction() ) {
    console.log('xx');
    plugins.push(
        
        new webpack.DefinePlugin({
         'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,        //去掉注释
            compress: {
                warnings: false    //忽略警告,要不然会有一大堆的黄色字体出现……
            }
        })
)}

module.exports = {
    devtool:isProduction()?null:'source-map',
    entry:{
        app:path.resolve(__dirname ,'react/index.react.js'),
        vendor: ['react', 'react-dom','react-router','jquery']
    },
    output:{
        path: path.resolve(__dirname ,'build'),
        publicPath: "/",
        filename: "[name].js"
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

    plugins:plugins,
    devServer:{
        colors:true,
        historyApiFallback:true,
        inline:true,
        hot:true
    }
}
