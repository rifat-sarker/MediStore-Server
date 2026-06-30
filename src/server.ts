import app from "./app";
import { Server } from "http";
import config from "./app/config";
import prisma from "./app/utils/prisma";
import { connectRedis } from "./app/utils/redis";

let server: Server;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
    
    await connectRedis();

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
