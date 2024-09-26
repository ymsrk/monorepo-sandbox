import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import prisma from "../../libs/src/prismaClient"; // Prismaクライアント

// ElasticSearchクライアントの初期化
const esClient = new ElasticsearchClient({ node: "http://localhost:9200" });

async function main() {
  try {
    // MySQLからPostDateのデータを取得
    const postDates = await prisma.postDate.findMany();

    if (postDates.length === 0) {
      console.log("No data found in PostDate");
      return;
    }

    // 取得したデータに対してElasticSearchを確認
    for (const postDate of postDates) {
      try {
        // ElasticSearchでキャッシュ確認
        const cachedData = await esClient.get({
          index: "post_dates",
          id: postDate.id,
        });

        // キャッシュが存在する場合は _source からデータを取得
        if (cachedData.found) {
          console.log(`Data retrieved from ElasticSearch cache: ${JSON.stringify(cachedData._source)}`);
          continue; // キャッシュがある場合、次のループへ
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        // キャッシュが存在しない場合 (404エラーの場合)
        if (error.meta?.statusCode === 404) {
          console.log(`No cache found in ElasticSearch for ID: ${postDate.id}`);
        } else {
          // その他のエラーの場合
          console.error(`Error retrieving data from ElasticSearch: ${error}`);
          continue;
        }
      }

      // キャッシュがない場合、データをElasticSearchにインデックス
      const esResponse = await esClient.index({
        index: "post_dates", // ElasticSearchのインデックス名
        id: postDate.id, // ドキュメントのIDとしてPostDateのIDを使用
        body: postDate, // 取得したPostDateのデータをそのまま保存
      });

      console.log(`Data indexed in Elasticsearch: ${JSON.stringify(esResponse)}`);
    }

    console.log("Data successfully processed.");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Prismaクライアントを閉じる
    await prisma.$disconnect();
  }
}

// 実行
main();
