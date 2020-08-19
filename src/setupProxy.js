const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/login',
    createProxyMiddleware({
      target: 'http://localhost:44444',
      changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:44444',
      changeOrigin: true,
    })
  );
};
