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
  await prisma.user.createMany({
    data: initUsers,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
