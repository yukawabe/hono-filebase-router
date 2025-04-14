import typegenPlugin, { TypegenOptions } from './typegen'
import typeMergePlugin, { TypeMergeOptions } from './typemerge'

export type ApiTypePluginOptions = {
  typegen?: TypegenOptions
  typeMerge?: TypeMergeOptions
}

export function apiTypePlugin(options: ApiTypePluginOptions = {}) {
  return [
    typegenPlugin(options.typegen || {}),
    typeMergePlugin(options.typeMerge || {})
  ]
}

export { typegenPlugin, typeMergePlugin }