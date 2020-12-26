const path = require('path')

module.exports = {
  async headers() {
    return [
      {
        source: '/api/(.+)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=1, stale-while-revalidate=59',
          },
        ],
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

    // Mark `server-dist` folder as external
    const serverDist = path.resolve('server-dist')
    // Note that webpack 5 will change the function signature
    config.externals.push((context, request, callback) => {
      if (request.startsWith('@server/')) {
        // Externalize to a commonjs module using the request path
        return callback(
          null,
          'commonjs ' + request.replace('@server', serverDist),
        )
      }

      if (request[0] === '.' && context.includes(serverDist)) {
        return callback(null, 'commonjs' + path.join(serverDist, request))
      }

      // Continue without externalizing the import
      callback()
    })

    return config
  },
}
