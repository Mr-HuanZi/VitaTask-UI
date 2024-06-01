/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> http://127.0.0.1:8081/**
    '/v1': {
      // 要代理的地址
      target: 'http://127.0.0.1:18081/',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/v1': '' },
    },
    '/uploads': {
      // 文件上传目录代理
      // 后端已做了静态资源目录转换
      target: 'http://127.0.0.1:18081/',
      changeOrigin: true,
    },
  },
  docker: {
    // localhost:8000/api/** -> http://127.0.0.1:8081/**
    '/v1': {
      // 要代理的地址
      target: 'http://host.docker.internal:8081/',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/v1': '' },
    },
    '/uploads': {
      // 文件上传目录代理
      // 后端已做了静态资源目录转换
      target: 'http://host.docker.internal:8081/',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
