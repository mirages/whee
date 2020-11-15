import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

const pkg = require('./package.json')
const banner = `
/*!
 * ${pkg.name}
 * v${pkg.version}
 * by ${pkg.author}
 */
`

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: "./",
      entryFileNames: 'dist/[name].umd.js',
      format: 'umd',
      name: pkg.name,
      banner
    },
    {
      dir: "./",
      entryFileNames: 'dist/[name].esm.js',
      format: 'es',
      banner
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    ts({
      sourceMap: false,
      // 生成 .d.ts 文件。参考：https://github.com/rollup/plugins/issues/61#issuecomment-597090769
      declaration: true,
      declarationDir: 'types/',
      rootDir: 'src/'
    }),
    terser({
      output: {
        comments: (node, comment) => {
          const text = comment.value
          const type = comment.type
          if (type == 'comment2') {
            // multiline comment
            return /^!/.test(text)
          }
        }
      }
    }),
    postcss({
      // css module
      modules: true,
      extract: 'dist/index.css',
      minimize: true
    })
  ]
}
