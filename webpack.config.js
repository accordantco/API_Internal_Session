const path = require('path');

module.exports = [
    {
        mode: 'development',
        entry: path.resolve(__dirname, 'src/index.js'),
        output: {
            path: path.resolve(__dirname, 'dist/1.0.2'),
            filename: 'bundle.js'
        },
    },
    {
        mode: 'production',
        entry: path.resolve(__dirname, 'src/index.js'),
        output: {
            path: path.resolve(__dirname, 'dist/latest'),
            filename: 'bundle.js'
        },
    }
]