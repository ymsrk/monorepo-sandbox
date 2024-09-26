import bcrypt from 'bcrypt';
import prisma from '../libs/src/prismaClient';

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
  
  // post_dateに新規登録
  const postDate = await prisma.postDate.create({
    data: {
      postCreatedAt: new Date(),
      postUpdatedAt: new Date(),
    }
  });
  
  const postDate2 = await prisma.postDate.create({
    data: {
      postCreatedAt: new Date(),
      postUpdatedAt: new Date(),
    }
  });
  
  const postDate3 = await prisma.postDate.create({
    data: {
      postCreatedAt: new Date(),
      postUpdatedAt: new Date(),
    }
  });

  console.log(`😻  ${nodeStatus}`)
  console.log({ user, comment, postDate });
  
  const getPostDate = await prisma.postDate.findMany();
  console.log(getPostDate[0].postUpdatedAt,);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
