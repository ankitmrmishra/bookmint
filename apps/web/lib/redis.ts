import { Redis } from "@upstash/redis";

// 👇 we can now import our redis client anywhere we need it
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const NONCE_PREFIX = "auth:nonce:";
const NONCE_EXPIRY = 300; // 5 minutes in seconds

export async function storeNonce(
  walletAddress: string,
  nonce: string
): Promise<void> {
  const key = `${NONCE_PREFIX}${walletAddress}`;
  await redis.setex(key, NONCE_EXPIRY, nonce);
}

export async function getNonce(walletAddress: string): Promise<string | null> {
  const key = `${NONCE_PREFIX}${walletAddress}`;
  return await redis.get(key);
}

export async function deleteNonce(walletAddress: string): Promise<void> {
  const key = `${NONCE_PREFIX}${walletAddress}`;
  await redis.del(key);
}
