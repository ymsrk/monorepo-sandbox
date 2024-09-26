import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import prisma from "../../libs/src/prismaClient"; // Prismaクライアント

// ElasticSearchクライアントの初期化
const esClient = new ElasticsearchClient({ node: "http://localhost:9200" });

async function main() {
  const id = "cm1j3w4x600014qkkall2urxb";

  try {
    // ElasticSearchでキャッシュ確認
    let cachedData = undefined;
    try {
      cachedData = await esClient.get({
        index: "post_dates",
        id,
      });
    } catch (error) {}
    // キャッシュが存在する場合は _source からデータを取得
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (cachedData && cachedData.found) {
      console.log("⚽️ Data retrieved from ElasticSearch cache:");
      console.log(`${JSON.stringify(cachedData._source, null, 2)}`);
    } else {
      console.log("🏀 Data not found in ElasticSearch cache.");
      const postDate = await prisma.postDate.findFirst({ where: { id } });
      if (!postDate) {
        console.log("No data found in MySQL");
      } else {
        // 取得したデータをElasticSearchにキャッシュとして保存
        const esResponse = await esClient.index({
          index: "post_dates", // ElasticSearchのインデックス名
          id: postDate.id, // ドキュメントのIDとしてPostDateのIDを使用
          body: postDate, // 取得したPostDateのデータをそのまま保存
        });
        console.log(`🐸 Data indexed in Elasticsearch: ${JSON.stringify(esResponse._index, null, 2)}`);
        console.log("⭐️ Data successfully processed.");
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Prismaクライアントを閉じる
    await prisma.$disconnect();
  }
}

// 実行
main();
