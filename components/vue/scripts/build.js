const { rollup } = require('rollup')
const fs = require('fs')
const path = require('path')
const { babel } = require('@rollup/plugin-babel')
const postcss = require('rollup-plugin-postcss')

const build = async () => {
  const dir = path.resolve(__dirname, '../src')
  const files = await fs.promises.readdir(dir)

  files.forEach(async file => {
    try {
      const componentPath = path.resolve(dir, file)
      const stats = await fs.promises.stat(componentPath)
      const input = path.resolve(componentPath, 'index.tsx')

      if (!stats.isDirectory()) return
      if (!fs.existsSync(input)) return

      const distDir = path.resolve(__dirname, '../es', file)
      const bundle = await rollup({
        input,
        plugins: [
          babel({
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            babelHelpers: 'inline',
            sourceMaps: false,
            skipPreflightCheck: true
          }),
          postcss({
            // css module
            extensions: ['.css', '.less'],
            autoModules: false, // 关闭自动 css module，使用自定义的 css module
            modules: {
              generateScopedName: '[local]__[contenthash:base64:8]'
            },
            extract: path.resolve(distDir, 'index.css')
          })
        ],
        external: ['vue']
      })

      await bundle.write({
        dir: distDir,
        format: 'es'
      })
      await bundle.close()
    } catch (e) {
      console.log(e)
    }
  })
}

build().catch(console.error)
