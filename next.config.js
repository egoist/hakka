const path = require('path')

module.exports = {
  // future: { webpack5: true },

  rewrites() {
    return [
      {
        source: '/admin/queues/:slug*',
        destination: '/api/admin/queues',
      },
      {
        source: '/feed.json',
        destination: '/api/feed',
      },
    ]
  },

  webpack(config, { dev, isServer }) {
    // Replace React with Preact in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    if (isServer) {
      config.module.rules.push({
        test: /\.ts$/,
        loader: 'ts-loader',
        enforce: 'pre',
        options: {
          transpileOnly: true,
        },
      })
    }

    const WindiCSSPlugin = require('windicss-webpack-plugin').default
    config.plugins.push(new WindiCSSPlugin())

    return config
  },
}
