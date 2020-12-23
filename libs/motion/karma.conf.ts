import type { Config, ConfigOptions } from 'karma'
import type { KarmaTypescriptConfig } from 'karma-typescript'

const karmaTypescriptConfig: KarmaTypescriptConfig = {
  // 引用的是 libs/tsconfig.json 文件，则相当于 ts 的工作目录是 libs
  tsconfig: '../tsconfig.json',
  compilerOptions: {
    // module: 'umd',
    // 测试用例运行在浏览器中，只能是 es5 代码
    target: 'ES5',
    // 必须输出 js 文件，需要执行生成的 js 文件
    noEmit: false,
    // 覆盖率测试报告需要
    sourceMap: true
  },
  // include 是根据 ts 的工作目录 libs 进行解析的
  include: ['motion/test/**/*'],
  reports: {
    html: {
      directory: 'coverage',
      subdirectory: 'html'
    },
    json: {
      directory: 'coverage',
      subdirectory: 'json',
      filename: 'coverage.json'
    },
    lcovonly: {
      directory: 'coverage',
      subdirectory: 'lcovonly',
      filename: 'coverage.txt'
    },
    // 在控制台中输出测试报告概要，===== Coverage summary =====
    'text-summary': ''
  }
}

// Karma configuration
export = function (config: Config): void {
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
    exclude: [],

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
    karmaTypescriptConfig,

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
    browsers: [process.env.TRAVIS ? 'ChromeHeadless' : 'Chrome'],

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
    singleRun: process.env.TRAVIS ? true : false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  } as ConfigOptions)
}
