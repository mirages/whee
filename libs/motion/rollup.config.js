import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import banner from 'rollup-plugin-banner'

const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    {
      // dir 构建目录，多文件构建
      // file 构建文件名，单文件构建。dir 和 file 只能二选一
      dir: "./",
      entryFileNames: 'dist/[name].umd.js',
      format: 'umd',
      name: 'Motion',
      plugins: [
        uglify({
          mangle: true
        })
      ]
    },
    {
      dir: "./",
      entryFileNames: 'dist/[name].esm.js',
      format: 'es'
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      // 可覆盖 tsconfig.json 文件中的 CompilerOptions 配置
      // https://github.com/rollup/plugins/tree/master/packages/typescript/#readme
      sourceMap: false,
      // 生成 .d.ts 文件。参考：https://github.com/rollup/plugins/issues/61#issuecomment-597090769
      declaration: true,
      declarationDir: 'types/',
      rootDir: 'src/'
    }),
    banner(`${pkg.name}\nv${pkg.version}\nby ${pkg.author}`)
  ]
}