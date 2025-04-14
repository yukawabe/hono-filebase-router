/**
 * ファイルパスをルーティングパスに変換する関数
 * @param filePath 変換するファイルパス
 * @param options オプション設定
 * @returns 変換されたルーティングパス
 */
export function filePathToPath(
  filePath: string, 
  options: { includeDeclaration?: boolean } = {}
): string {
  const { includeDeclaration = false } = options
  
  // 宣言ファイル(.d.ts)を含むかどうかに基づいてパターンを選択
  const extensionPattern = includeDeclaration ? /\.d\.tsx?$/g : /\.tsx?$/g
  
  filePath = filePath
    .replace(extensionPattern, '')
    .replace(/^\/?index/, '/')
    .replace(/\/index/, '')
    .replace(/\[\.{3}.+\]/, '*')
    // すべての[param]を:paramに変換するために、globalフラグ付きで置換
    .replace(/\[([^\]]+)\]/g, ':$1')
  
  const result = /^\//.test(filePath) ? filePath : '/' + filePath
  return result
} 