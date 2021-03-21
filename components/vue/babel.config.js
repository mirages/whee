const { NODE_ENV } = process.env
const isTest = NODE_ENV === 'test'

const presets = [
  [
    '@babel/preset-typescript',
    {
      isTSX: true,
      allExtensions: true
    }
  ]
]
const plugins = ['@vue/babel-plugin-jsx']

if (isTest) {
  // 单元测试，需要 babel 转义
  presets.push([
    '@babel/preset-env',
    {
      modules: 'commonjs'
    }
  ])
  plugins.push([
    '@babel/plugin-transform-runtime',
    {
      absoluteRuntime: false,
      corejs: false,
      useESModules: false
    }
  ])
}

module.exports = {
  presets,
  plugins
}
