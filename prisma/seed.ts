import { PrismaClient } from '../lib/prisma';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// day.jsプラグインの使用を宣言
dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

async function main() {
  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash("securepassword", 10);
  
  // 現在の日本時間を取得して、UTCに変換
  const currentJstTimeInUtc = dayjs().tz('Asia/Tokyo').utc().toDate();

  // サンプルデータの登録
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      createdAt: currentJstTimeInUtc, // UTCに変換した日本時間を設定
      Post: {
        create: [
          {
            title: 'First Post',
            content: 'This is my first post.',
            createdAt: currentJstTimeInUtc // Postの作成時刻も同様にUTCに変換した日本時間
          },
          {
            title: 'Second Post',
            content: 'This is my second post.',
            createdAt: currentJstTimeInUtc
          }
        ]
      }
    }
  });

  const comment = await prisma.comment.create({
    data: {
      content: 'This is a comment',
      createdAt: currentJstTimeInUtc,
      author: {
        connect: { id: user.id }
      },
      post: {
        connect: { id: 1 } // Example post ID
      }
    }
  });

  console.log({ user, comment });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
