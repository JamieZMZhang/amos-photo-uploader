module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: function (config, env) {
        config.output.chunkFilename = 'chunk.js';
        config.output.filename = 'main.js';
        config.optimization.splitChunks = false;
        config.optimization.runtimeChunk = false;
        return config;
    },
}