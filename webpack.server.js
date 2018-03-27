const conf = require('./webpack.shared');
const path = require('path');
const vue = require('vue');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

let base = conf('production', true);

const fin = Object.assign(base, {
    entry: ['vue', './scripts/entry.server.js'],
    target: 'node',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
        whitelist: '/\.css$/'
    }),
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new VueSSRServerPlugin()
    ]
});

module.exports = fin;