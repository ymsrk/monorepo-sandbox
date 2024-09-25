import { PrismaClient } from "../generated/prisma/client";

/**
 * PrismaClientのインスタンスを作成します。
 * ログレベルに応じてイベントを発行します。
 *
 * ログレベル:
 * - query: クエリの実行時に発行されるイベント
 * - info: 情報レベルのログイベント
 * - warn: 警告レベルのログイベント
 * - error: エラーレベルのログイベント
 */
const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("query", (e) => {
  console.log(`Query: ${e.query}`);
  console.log(`Params: ${e.params}`);
  console.log(`Duration: ${e.duration}ms`);
});

prisma.$on("info", (e) => {
  console.log(`Info: ${e.message}`);
});

prisma.$on("warn", (e) => {
  console.warn(`Warning: ${e.message}`);
});

prisma.$on("error", (e) => {
  console.error(`Error: ${e.message}`);
});

export { prisma };
