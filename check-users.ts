import prisma from "./src/app/utils/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'ADMIN' },
  });
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
