import type { Plugin } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { rm } from 'node:fs/promises'

export type TypegenOptions = {
  entry?: string
  outDir?: string
  include?: string[]
  beforeWriteFile?: (filePath: string) => { filePath: string } | undefined
}

export const defaultOption: Required<TypegenOptions> = {
  entry: 'src/server/index.tsx',
  outDir: '.typegen',
  include: ['src/server/api/**/*.ts'],
  beforeWriteFile: (filePath: string) => {
    const newFilePath = filePath.replace(/\/src\/server\/api\//, '/api/')
    return { filePath: newFilePath }
  }
}

/**
 * TypeScriptの型定義ファイルを生成するViteプラグイン
 */
export function typegenPlugin(options: TypegenOptions = {}): Plugin[] {
  const entry = options.entry ?? defaultOption.entry
  const outDir = options.outDir ?? defaultOption.outDir
  const include = options.include ?? defaultOption.include
  const beforeWriteFile = options.beforeWriteFile ?? defaultOption.beforeWriteFile

  let isTypegenMode = false

  const generateTypes = () => {
    return dts({
      outDir,
      include,
      beforeWriteFile,
      declarationOnly: true,
      afterBuild: () => {
        console.log(`✅ Types are regenerated into ${outDir}`)
      }
    })
  }

  return [
    {
      name: 'vite-plugin-typegen-mode-detector',
      config: (_config, { command, mode }) => {
        isTypegenMode = command === 'build' && mode === 'typegen'
        
        if (isTypegenMode) {
          return {
            build: {
              outDir: 'temp-typegen',
              lib: {
                entry: resolve(process.cwd(), entry),
                name: 'typegen',
                formats: ['es']
              }
            }
          }
        }
        return {}
      },
      closeBundle: async () => {
        if (isTypegenMode) {
          try {
            await rm('temp-typegen', { recursive: true, force: true });
          } catch (error) {
            console.error('Failed to remove temp-typegen directory:', error);
          }
        }
      }
    },
    {
      ...generateTypes(),
      enforce: 'post',
      apply: (_, { command, mode }) => {
        return command === 'build' && mode === 'typegen'
      }
    }
  ]
}

export default typegenPlugin
