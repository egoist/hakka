const path = require('path')
const { getConnectionManager } = require('typeorm')

class FixServerReloadPlugin {
  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      'FixServerReloadPlugin',
      async (compilation) => {
        const moduleIds = Object.keys(require.cache)
        const TESTS = [/server-dist/]
        TESTS.forEach((regex) => {
          moduleIds.forEach((moduleId) => {
            if (regex.test(moduleId)) {
              // console.log(moduleId)
              delete require.cache[moduleId]
            }
          })
        })
        // Connection needs to be recreated before entities are recreated
        const cm = getConnectionManager()
        if (cm.has('default')) {
          console.log('Closing connection..')
          const connection = cm.get('default')
          await connection.close()
          cm.connections = cm.connections.filter((c) => c.name !== 'default')
        }
      },
    )

    compiler.hooks.afterCompile.tap('FixServerReloadPlugin', (compilation) => {
      compilation.contextDependencies.add(path.resolve('server-dist'))
    })
  }
}

module.exports = {
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

    if (dev) {
      config.plugins.push(new FixServerReloadPlugin())
    }

    return config
  },
}
