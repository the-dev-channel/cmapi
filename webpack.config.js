const path = require('path');

module.exports = {
    entry: './index.js',
    mode: 'production',
    output: {
        filename: 'cmapi.dist.js',
        path: path.resolve(__dirname, 'dist')
    }
}
