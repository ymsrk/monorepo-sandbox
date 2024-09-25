import { prisma } from '../libs/src/prismaClient';
import bcrypt from 'bcrypt';

const nodeStatus = process.env.NODE_ENV

async function main() {
  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash("securepassword", 10);

  // サンプルデータの登録
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      Post: {
        create: [
          {
            title: 'First Post',
            content: 'This is my first post.',
          },
          {
            title: 'Second Post',
            content: 'This is my second post.',
          }
        ]
      }
    }
  });

  const comment = await prisma.comment.create({
    data: {
      content: 'This is a comment',
      author: {
        connect: { id: user.id }
      },
      post: {
        connect: { id: 1 } // Example post ID
      }
    }
  });

  console.log(`😻  ${nodeStatus}`)
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
