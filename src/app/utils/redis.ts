import { createClient } from "redis";
import config from "../config";

const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

let realClient: any = null;

if (config.redis_url && !config.redis_url.includes("localhost") && !config.redis_url.includes("127.0.0.1")) {
  try {
    realClient = createClient({
      url: config.redis_url,
    });
    realClient.on("error", (err: any) => console.warn("Redis error:", err?.message || err));
  } catch (e) {
    realClient = null;
  }
}

export const connectRedis = async () => {
  if (realClient && !realClient.isOpen) {
    try {
      await realClient.connect();
    } catch (err: any) {
      console.warn("⚠️ Redis connect failed:", err?.message);
    }
  }
};

const redisClient = {
  isOpen: false,
  get: async (key: string): Promise<string | null> => {
    if (realClient?.isOpen) {
      try {
        return await realClient.get(key);
      } catch {}
    }
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },
  set: async (key: string, value: string): Promise<void> => {
    if (realClient?.isOpen) {
      try {
        await realClient.set(key, value);
        return;
      } catch {}
    }
    memoryStore.set(key, { value });
  },
  setEx: async (key: string, seconds: number, value: string): Promise<void> => {
    if (realClient?.isOpen) {
      try {
        await realClient.setEx(key, seconds, value);
        return;
      } catch {}
    }
    memoryStore.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
  },
  del: async (key: string): Promise<void> => {
    if (realClient?.isOpen) {
      try {
        await realClient.del(key);
        return;
      } catch {}
    }
    memoryStore.delete(key);
  },
};

export default redisClient;

