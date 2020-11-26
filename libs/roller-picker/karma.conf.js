require('ts-node').register({
  skipProject:true,
  transpileOnly: true,
  strictNullChecks: false,
  strictFunctionTypes: false,
  compilerOptions: {
    module: 'es6',
    target: 'es6',
    strictNullChecks: false,
    strictFunctionTypes: false
  }
})

module.exports = require('./karma.conf.ts')
