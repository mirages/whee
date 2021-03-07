const { NODE_ENV } = process.env

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: NODE_ENV === 'test' ? 'commonjs' : false,
        loose: true
      }
    ],
    [
      '@babel/preset-typescript',
      {
        isTsx: true,
        allExtentions: true
      }
    ]
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: NODE_ENV !== 'test'
      }
    ]
  ]
}
