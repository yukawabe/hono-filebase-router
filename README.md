# Hono ファイルベースルーティング & 型定義生成フレームワーク

このプロジェクトは、[Hono](https://hono.dev/) フレームワークを使用して、ファイルベースルーティングと自動型定義生成機能を提供するフレームワークです。

## 利用方法
```
npm install
npm run typegen
npm run dev
```

## 主な機能

### 1. ファイルベースルーティング

`src/server/api` ディレクトリ内のファイル構造に基づいて自動的にAPIルートを生成します。例えば：

- `src/server/api/users/[id].ts` → `/users/:id`
- `src/server/api/todos.ts` → `/todos`
- `src/server/api/index.ts` → `/`

この機能により、ファイルシステムの構造がそのままAPIのURLパス構造になり、直感的にAPIエンドポイントを管理できます。

### 2. 自動型定義生成

APIエンドポイントの型定義を自動的に生成し、フロントエンドとバックエンドの型安全性を確保します。

- `typegenPlugin`: TypeScriptの型定義ファイル（.d.ts）を生成します
- `typeMergePlugin`: 生成された型定義ファイルを結合し、クライアント側から利用しやすい形式に整形します

これにより、APIのリクエスト・レスポンスの型が自動的に同期され、型の不一致によるバグを防ぎます。

## 仕組み

このフレームワークは以下の主要なViteプラグインで構成されています：

1. `router.ts` - ファイルシステムに基づいたルーティングを実現
2. `typegen.ts` - TypeScriptの型定義ファイルを生成 
3. `typemerge.ts` - 生成された型定義ファイルを結合
4. `util.ts` - ファイルパスをルーティングパスに変換するユーティリティ関数を提供

## 参考プロジェクト

このプロジェクトは以下のリポジトリを参考にしています：

- [file-base-routing-framework](https://github.com/yusukebe/file-base-routing-framework)
- [my-app-typegen](https://github.com/yusukebe/my-app-typegen)
