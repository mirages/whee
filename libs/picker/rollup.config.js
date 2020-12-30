import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'

const pkg = require('./package.json')
const banner = `
/*!
 * ${pkg.name}
 * v${pkg.version}
 * by ${pkg.author}
 */
`

const LIST = [
  {
    input: { index: 'src/index.ts' },
    format: 'umd',
    folder: 'dist',
    globalName: pkg.name
  },
  {
    input: { index: 'src/index.ts' },
    format: 'es',
    folder: 'es'
  }
]

// Rollup doesn't support multi entry for umd and iif output.
// Related issue: https://github.com/rollup/rollup/issues/2935
export default LIST.map(item => ({
  input: item.input,
  output: {
    dir: './',
    entryFileNames: `${item.folder}/[name].js`,
    format: item.format,
    ...(item.format === 'umd'
      ? {
          name: item.globalName,
          banner,
          plugins: [
            terser({
              output: {
                comments: (node, comment) => {
                  const text = comment.value
                  const type = comment.type
                  if (type == 'comment2') {
                    // multiline comment
                    return /^!/.test(text) && !/Copyright/.test(text)
                  }
                }
              }
            })
          ]
        }
      : {})
  },
  plugins: [
    nodeResolve(),
    ts({
      // 引用的是 libs/tsconfig.json 文件，则相当于 ts 的工作目录是 libs
      tsconfig: '../tsconfig.json',
      sourceMap: false,
      // 这里的 include 仍然是相对于 rollup.config.js 文件所在的目录
      include: ['../motion/**/*.ts', '*.d.ts', 'src/**/*.ts'],
      ...(item.format === 'umd'
        ? {
            target: 'ES5'
          }
        : {})
    }),
    postcss({
      // css module
      extensions: ['.css', '.less'],
      autoModules: false, // 关闭自动 css module，使用自定义的 css module
      modules: {
        generateScopedName: '[local]__[contenthash:base64:8]'
      },
      extract: `${item.folder}/index.css`,
      minimize: item.format === 'umd'
    })
  ],
  external: [
    '@whee/js-motion'
  ]
}))
