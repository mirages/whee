// Karma configuration
// Generated on Mon Sep 14 2020 13:49:19 GMT+0800 (GMT+08:00)
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    // basePath: 'test',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: [
      // { pattern: '*.test.js', watched: false }
      'test/**/*.test.ts',
      'test/helper.ts',
      'src/**/*.ts'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'karma-typescript'],

    // mocha reporter 配置
    mochaReporter: {
      showDiff: true,
      output: 'minimal',
      divider: ''
    },

    // karma typescript 插件：https://www.npmjs.com/package/karma-typescript
    // Run unit tests written in Typescript with full type checking
    // Get remapped test coverage with Istanbul.
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      compilerOptions: {
        // module: 'umd',
        target: 'es5',
        noEmit: false
      },
      include: [
        "test/**/*"
      ],
      reports: {
        html: {
          directory: 'coverage',
          subdirectory: 'html'
        },
        'text-summary': null
      }
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    client: {
      // 具体用法可查看：https://www.npmjs.com/package/karma-mocha
      // mocha 配置查看：https://mochajs.org/#usage
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',
        ui: 'bdd',
        // require: [require.resolve('@babel/register')],
        timeout: 5000
      },
      // 每跑完一个测试用例，就清掉客户端的 window 上下文环境
      clearContext: true,
      // 使用新的窗口运行测试用例，而不是在一个 iframe 中运行
      // useIframe: false,
      // 是否捕获客户端控制台的日志
      captureConsole: false
    },

    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-typescript'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
