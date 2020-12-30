import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

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

export default LIST.map(item => ({
  input: 'src/index.ts',
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
    typescript({
      // 引用的是 libs/tsconfig.json 文件，则相当于 ts 的工作目录是 libs
      tsconfig: '../tsconfig.json',
      // 可覆盖 tsconfig.json 文件中的 CompilerOptions 配置
      // https://github.com/rollup/plugins/tree/master/packages/typescript/#readme
      sourceMap: false,
      // 这里的 include 仍然是相对于 rollup.config.js 文件所在的目录
      include: ['src/**/*.ts'],
      ...(item.format === 'umd'
        ? {
            target: 'ES5'
          }
        : {})
    })
  ]
}))
