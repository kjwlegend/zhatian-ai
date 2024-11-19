const path = require('path');
const fs = require('fs');
const { VueLoaderPlugin } = require('vue-loader');
const webpackMerge = require('webpack-merge'); // 使用解构导入

// 读取 components-light 目录下的文件
const componentsDir = path.join(process.cwd(), 'src', 'components', 'lightPage');
// const componentsDir = path.resolve(__dirname, 'components-light');
console.error('%c  componentsDir', 'background-image:color:transparent;color:red;');
console.error('🚀~ => ', componentsDir);
const components = fs.readdirSync(componentsDir)
    .filter(file => fs.statSync(path.join(componentsDir, file)).isDirectory());
console.error('%c components ', 'background-image:color:transparent;color:red;');
console.error('🚀~ => ', components);

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
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: ['url-loader', 'file-loader'],
            },
            {
                test: /\.(woff|woff2|eot|otf|ttf|ttc)$/,
                use: ['file-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]],
                    },
                },
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
        // filename: `[name].js`,
        library: `Gucci-${component}`,
        libraryTarget: 'window',
        // library: {
        //     name: `Gucci-${component}`,
        //     type: 'window',
        //     export: 'default',
        // },
    },
}));
