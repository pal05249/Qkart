const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        'http://localhost:8082/api', // Replace this with the base URL of your Node.js server
        createProxyMiddleware({
            target: 'http://localhost:3000', // Replace this with the actual address of your Node.js server
            changeOrigin: true,
        })
    );
};
