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

export default {
  input: 'src/index.ts',
  output: [
    {
      // dir 构建目录，多文件构建
      // file 构建文件名，单文件构建。dir 和 file 只能二选一
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
    typescript({
      // 可覆盖 tsconfig.json 文件中的 CompilerOptions 配置
      // https://github.com/rollup/plugins/tree/master/packages/typescript/#readme
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
            return /^!/.test(text) && !/Copyright/.test(text)
          }
        }
      }
    })
  ]
}