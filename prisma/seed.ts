import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 数据库初始化
const initUsers = [
  {
    name: 'admin',
    password: 'admin',
  },
];

async function main() {
  const users = await prisma.user.createMany({
    data: initUsers,
  });
  console.log('createUsers result:', users);
}

main()
  .catch((e) => {
    console.error('Error info:', e.message);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
