const path = require('path');
const fs = require('fs');
const { VueLoaderPlugin } = require('vue-loader');
const webpackMerge = require('webpack-merge');

// 读取 components-light 目录下的文件
const componentsDir = path.resolve(__dirname, 'components-light');
const components = fs.readdirSync(componentsDir)
    .filter(file => fs.statSync(path.join(componentsDir, file)).isDirectory());

// 基础配置
const baseConfig = {
    mode: 'production',
    externals: {
        vue: {
            commonjs: 'vue',
            commonjs2: 'vue',
            root: 'Vue',
        },
    },
    output: {
        globalObject: 'typeof self !== "undefined" ? self : this',
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ]
    },
    plugins: [new VueLoaderPlugin()],
    optimization: {
        minimize: true,
    },
};

// 为每个组件创建配置
module.exports = components.map(component => webpackMerge(baseConfig, {
    entry: path.resolve(componentsDir, component),
    output: {
        filename: `${component}.js`,
        library: {
            name: `Gucci-${component}`,
            type: 'window',
            export: 'default',
        },
    },
}));
