import tsPlugin from 'rollup-plugin-typescript2'
import spawnPlugin from 'rollup-plugin-spawn'
import glob from 'fast-glob'

const entities = glob.sync('src/orm/*.entity.ts')
const migrations = glob.sync('src/migrations/*.ts')

/** @type {import('rollup').RollupOptions} */
const config = {
  input: ['src/main.ts', ...entities, ...migrations],
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'named',
    // Required to preserve src folder structure
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  plugins: [
    tsPlugin({
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
          // declaration: true,
        },
      },
    }),
    spawnPlugin({
      command: `npm run start`,
    }),
  ],
  external: ['dotenv/config'],
}

export default config
