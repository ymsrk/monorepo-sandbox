// ソースコードの要約
// 1. Prisma Client のインスタンス管理:
//    - **開発環境**では、`globalThis` を利用して `PrismaClient` をグローバルにキャッシュし、再利用することで不要なインスタンス生成を防ぎ、メモリ効率を向上させています。
//    - **本番環境**では、常に新しい `PrismaClient` インスタンスを作成し、確実なクリーンな実行環境を維持しています。
// 2. クエリ・イベントログの出力:
//    - Prismaのクエリや情報、警告、エラーに対してログ出力を行い、絵文字を使って視覚的にわかりやすくしています。これにより、デバッグがしやすく、開発者がログを迅速に確認できる点が優れています。
// 3. ミドルウェアの活用:
//    - クエリ実行前に、`create` や `update` 操作で日付フィールドを JST に変換するロジックをミドルウェアとして実装しているため、データベースに正しいタイムゾーンでのデータを保存することができ、コードの再利用性が向上しています。
// 4. ログレベルの柔軟な設定:
//    - クエリやエラーに関するログを `event` として発行しているため、ログレベルに応じた細かいデバッグが可能です。これにより、クエリやパフォーマンスの問題を発見しやすくなっています。
// 5. 型安全性の確保:
//    - `globalThis` の型拡張によって `prisma` プロパティを明示的に型定義しており、TypeScriptの強みである型安全性が確保されています。

import { PrismaClient } from "../generated/prisma/client";

const client = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

// 開発環境またはDEBUG_LOGがtrueの場合のみログを出力
if (process.env.NODE_ENV === "development" || process.env.DEBUG_LOG === "true") {
  // イベントリスナーの設定
  client.$on("query", (e) => {
    console.log(`🔍 Query: ${e.query}`);
    console.log(`📦 Params: ${e.params}`);
    console.log(`⏳ Duration: ${e.duration}ms`);
  });

  client.$on("info", (e) => {
    console.log(`🟢 Info: ${e.message}`);
  });
}

client.$on("warn", (e) => {
  console.warn(`🟡 Warning: ${e.message}`);
});

client.$on("error", (e) => {
  console.error(`🔴 Error: ${e.message}`);
});

// Prisma Middlewareの設定
client.$use(async (params, next) => {
  console.log(`😀 prisma.params : ${params.action}`);

  // アクションがcreateかupdateの場合にのみ処理を実行
  if (params.action === "create" || params.action === "update") {
    const data = params.args?.data;
    if (data) {
      // 日付フィールドに対して+9時間の処理を行う
      for (const key in data) {
        if (data[key] instanceof Date) {
          const date: Date = data[key];
          const jstOffset = 9 * 60 * 60 * 1000; // 9時間をミリ秒に変換
          data[key] = new Date(date.getTime() + jstOffset);
        }
      }
    }
  }
  // クエリの実行
  return next(params);
});

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = client;
} else {
  // biome-ignore lint/style/useConst: <explanation>
  let globalPrisma = global as typeof globalThis & { prisma: PrismaClient };

  if (!globalPrisma.prisma) {
    console.log("🌱 Initializing new Prisma Client");
    globalPrisma.prisma = client;
  }
  prisma = globalPrisma.prisma;
}

export default prisma;
