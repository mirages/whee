// eslint-disable-next-line
/// <reference path="./typings/postcss-modules/index.d.ts" />
import type { Transform, TransformContext } from 'karma-typescript'
import less = require('less')
import postcss from 'postcss'
import { generateScopedName } from './karma-css-preprocessor'
import postCssModules = require('postcss-modules')

export default function (): Transform {
  const transform: Transform = (async (
    context: TransformContext,
    cb: (err: Error | null, dirty: boolean) => void
  ): Promise<void> => {
    if (/\.(less|css)$/.test(context.filename)) {
      let cssModuleJson = {}
      const { css } = await less.render(context.source)
      await postcss([
        postCssModules({
          generateScopedName,
          getJSON(cssFilename: string, json: { [prop: string]: string }) {
            // css module json
            cssModuleJson = json
          }
        })
      ]).process(css, {
        from: context.filename,
        map: {
          inline: true
        }
      })

      context.source = JSON.stringify(cssModuleJson)
      cb(null, true)
    } else {
      cb(null, false)
    }
  }) as Transform

  return transform
}
