import { createClient } from "redis";
import config from "../config";

const redisClient = createClient({
  url: config.redis_url || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;
