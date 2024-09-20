# monorepo-sandbox

このプロジェクトは、モノレポで管理するためのサンドボックスプロジェクトです。

## 環境構築

### TypeScript


```bash
npm install typescript prisma ts-node @types/node --save-dev
npm install @prisma/client
```

### Prisma

```bash
# prismaディレクトリがない状態で実行
npx prisma init
```


## Directory

プロジェクトの構成はこんな感じです。

```bash
monorepo-sandbox/
├── backend/ # nest api
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
├── jobs/ # Lambda function
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
├── prisma/ # database orm
│   ├── schema.prisma
│   └── ...
├── package.json
└── tsconfig.json
```

## 環境解説

モノレポ構成における`root`直下の`package.json`と各プロジェクトフォルダ（例: `jobs`や`migration`）内にある`package.json`の役割について説明します。

### 1. `root/package.json`（モノレポ全体の管理）
このファイルはモノレポ全体の共通依存関係やスクリプトを管理します。以下のような役割があります。
- **共通の依存関係の管理**: すべてのプロジェクトで共通して使用するパッケージ（例えば、`eslint`や`typescript`など）は、`root/package.json`で一括管理します。これにより、各プロジェクトごとに同じ依存関係を重複してインストールする必要がなくなります。
- **スクリプトの統一管理**: 例えば、`npm run lint`のように、全プロジェクトに対して共通のタスクを実行するためのスクリプトを定義できます。
- **ワークスペースの定義**: `package.json`の`workspaces`フィールドで各プロジェクト（`jobs`や`migration`）を指定し、モノレポ全体の依存関係やプロジェクトのリンクを管理します。

### 2. 各プロジェクトの`package.json`（例: `jobs/package.json`）
個々のプロジェクトに固有の依存関係やスクリプトを管理します。
- **プロジェクト固有の依存関係**: それぞれのプロジェクトが必要とするパッケージやライブラリを定義します。他のプロジェクトと異なる依存関係がある場合は、ここで管理します。
- **プロジェクト固有のスクリプト**: `jobs`や`migration`などのプロジェクトごとに異なるタスクを実行するためのスクリプトを定義します。例えば、`npm run start`が`jobs`では異なる動作をするかもしれません。
- **独立したプロジェクトとしての管理**: 各プロジェクトをモノレポの一部として統合しながらも、個別に開発やデプロイができるようにします。

このように、`root`の`package.json`は全体を統括し、各プロジェクトの`package.json`はそのプロジェクト固有の依存関係やタスクを管理します。
