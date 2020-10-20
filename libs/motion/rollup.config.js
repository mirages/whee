// import babel from '@rollup/plugin-babel'
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
      // dir: 'dist',
      // file 构建文件名，单文件构建。dir 和 file 只能二选一
      file: 'dist/motion.umd.js',
      format: 'umd',
      name: 'Motion',
      plugins: [
        uglify({
          mangle: true
        })
      ]
    },
    {
      file: 'dist/motion.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      // 可覆盖 tsconfig.json 文件中的 CompilerOptions 配置
      sourceMap: false
    }),
    // babel({
    //   babelHelpers: 'runtime',
    //   exclude: 'node_modules/**',
    //   extensions: ['.js', '.ts']
    // }),
    banner(`motion\nv${pkg.version}\nby ${pkg.author}`)
  ]
}