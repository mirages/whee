import type { InlinePluginDef } from 'karma'
import path = require('path')
import less = require('less')
import postcss from 'postcss'
import postCssModules = require('postcss-modules')

interface File {
  originalPath: string
  relativePath: string
  path: string
  sourceMap: string
  type: string
}

export const generateScopedName = '[local]__[contenthash:base64:8]'

function createCsspreprocessor() {
  return async (
    content: string,
    file: File,
    next: (err: Error | null, c?: string) => void
  ) => {
    // fix: karma serve file 404 on windows platform, because of the '\\'
    const outputFile = path
      .join(path.dirname(file.path), 'index.css')
      .replace(/\\/g, '/')
    const { css, map } = await less.render(content, {
      sourceMap: {
        sourceMapFileInline: true,
        outputSourceFiles: true
      },
      filename: path.basename(file.path)
    })
    const result = await postcss([
      postCssModules({
        generateScopedName,
        getJSON() {
          // css module json, do nothing
        }
      })
    ]).process(css, {
      from: file.path,
      to: outputFile,
      map: {
        prev: map,
        inline: true
      }
    })

    file.type = 'css' // karma serve as css file
    file.path = outputFile // 输出文件路径

    next(null, result.css)
  }
}

export default {
  'preprocessor:css': ['factory', createCsspreprocessor]
} as InlinePluginDef
