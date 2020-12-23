import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'

const pkg = require('./package.json')
const banner = name => `
/*!
 * ${name}
 * v${pkg.version}
 * by ${pkg.author}
 */
`

const LIST = [
  {
    input: { index: 'src/index.ts' },
    bannerName: pkg.name,
    globalName: pkg.name
  },
  {
    input: { 'factory/simple': 'src/factory/simple.ts' },
    bannerName: `${pkg.name}-factory-simple`,
    globalName: `${pkg.name}/factory/simple`
  },
  {
    input: { 'factory/datetime': 'src/factory/datetime.ts' },
    bannerName: `${pkg.name}-factory-datetime`,
    globalName: `${pkg.name}/factory/datetime`
  }
]

// Rollup doesn't support multi entry for umd and iif output.
// Related issue: https://github.com/rollup/rollup/issues/2935
export default LIST.map(item => ({
  input: item.input,
  output: [
    {
      dir: "./",
      entryFileNames: 'dist/[name].umd.js',
      format: 'umd',
      name: item.globalName,
      banner: banner(item.bannerName)
    },
    {
      dir: "./",
      entryFileNames: 'dist/[name].esm.js',
      format: 'es',
      banner: banner(item.bannerName)
    }
  ],
  plugins: [
    nodeResolve(),
    ts({
      // 引用的是 libs/tsconfig.json 文件，则相当于 ts 的工作目录是 libs
      tsconfig: '../tsconfig.json',
      sourceMap: false,
      // 生成 .d.ts 文件。参考：https://github.com/rollup/plugins/issues/61#issuecomment-597090769
      // declaration: true,
      // declarationDir: 'types/',
      // rootDir: 'src/'
      // 这里的 include 仍然是相对于 rollup.config.js 文件所在的目录
      include: [
        "../**/*.ts"
      ]
    }),
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
    }),
    postcss({
      // css module
      extensions: ['.css', '.less'],
      autoModules: false, // 关闭自动 css module，使用自定义的 css module
      modules: {
        generateScopedName: '[local]__[contenthash:base64:8]'
      },
      extract: 'dist/index.css',
      minimize: true
    })
  ]
}))
