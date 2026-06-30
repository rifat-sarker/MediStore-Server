import app from "./app";
import { Server } from "http";
import config from "./app/config";
import prisma from "./app/utils/prisma";
import { connectRedis } from "./app/utils/redis";
import { seedAdmin } from "./scripts/seedAdmin";

let server: Server;

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma");

    await connectRedis();

    // Seed default admin if none exists
    await seedAdmin();

    server = app.listen(config.port, () => {
      console.log(`🚀 MediStore server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

main();

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
