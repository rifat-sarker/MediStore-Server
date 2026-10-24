import { createClient } from "redis";
import config from "../config";

const redisClient = createClient({
  url: config.redis_url || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen && config.redis_url) {
      await redisClient.connect();
    }
  } catch (err) {
    console.warn("⚠️ Redis connection failed or skipped in serverless environment:", (err as any)?.message);
  }
};


export default redisClient;
