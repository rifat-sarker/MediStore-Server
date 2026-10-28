import { Redis } from "@upstash/redis";
import { createClient } from "redis";
import config from "../config";

const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

// 1. Upstash Serverless Redis (HTTP-based, perfect for Vercel & serverless)
let upstashClient: Redis | null = null;
if (config.upstash_redis_rest_url && config.upstash_redis_rest_token) {
  try {
    upstashClient = new Redis({
      url: config.upstash_redis_rest_url,
      token: config.upstash_redis_rest_token,
    });
    console.log("⚡ Connected to Upstash Serverless Redis");
  } catch (err: any) {
    console.warn("⚠️ Failed to initialize Upstash Redis:", err?.message);
    upstashClient = null;
  }
}

// 2. Standard TCP Redis (for Docker / VPS / local development)
let tcpClient: any = null;
if (
  !upstashClient &&
  config.redis_url &&
  !config.redis_url.includes("localhost") &&
  !config.redis_url.includes("127.0.0.1")
) {
  try {
    tcpClient = createClient({
      url: config.redis_url,
    });
    tcpClient.on("error", (err: any) =>
      console.warn("TCP Redis error:", err?.message || err)
    );
  } catch (e) {
    tcpClient = null;
  }
}

export const connectRedis = async () => {
  if (tcpClient && !tcpClient.isOpen) {
    try {
      await tcpClient.connect();
    } catch (err: any) {
      console.warn("⚠️ TCP Redis connect failed:", err?.message);
    }
  }
};

const redisClient = {
  isOpen: Boolean(upstashClient || tcpClient?.isOpen),

  get: async (key: string): Promise<string | null> => {
    // A. Upstash Redis
    if (upstashClient) {
      try {
        const val = await upstashClient.get<any>(key);
        if (val === null || val === undefined) return null;
        return typeof val === "string" ? val : JSON.stringify(val);
      } catch (err: any) {
        console.warn("⚠️ Upstash get failed, using memory:", err?.message);
      }
    }

    // B. Standard TCP Redis
    if (tcpClient?.isOpen) {
      try {
        return await tcpClient.get(key);
      } catch {}
    }

    // C. Memory fallback
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },

  set: async (key: string, value: string): Promise<void> => {
    if (upstashClient) {
      try {
        await upstashClient.set(key, value);
        return;
      } catch (err: any) {
        console.warn("⚠️ Upstash set failed:", err?.message);
      }
    }

    if (tcpClient?.isOpen) {
      try {
        await tcpClient.set(key, value);
        return;
      } catch {}
    }

    memoryStore.set(key, { value });
  },

  setEx: async (key: string, seconds: number, value: string): Promise<void> => {
    if (upstashClient) {
      try {
        await upstashClient.set(key, value, { ex: seconds });
        return;
      } catch (err: any) {
        console.warn("⚠️ Upstash setEx failed:", err?.message);
      }
    }

    if (tcpClient?.isOpen) {
      try {
        await tcpClient.setEx(key, seconds, value);
        return;
      } catch {}
    }

    memoryStore.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
  },

  del: async (key: string): Promise<void> => {
    if (upstashClient) {
      try {
        await upstashClient.del(key);
        return;
      } catch (err: any) {
        console.warn("⚠️ Upstash del failed:", err?.message);
      }
    }

    if (tcpClient?.isOpen) {
      try {
        await tcpClient.del(key);
        return;
      } catch {}
    }

    memoryStore.delete(key);
  },
};

export default redisClient;
