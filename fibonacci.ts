import { redisClient } from "./controller";

export default async function fibonacci(x: number): Promise<bigint> {
  if (x <= 1) return BigInt(1);

  const memoized = await redisClient.hGetAll(`fibonacci:${x}`);

  if (Object.keys(memoized).length) {
    return BigInt(memoized[x]);
  } else {
    await redisClient.hSet(
      `fibonacci:${x}`,
      x,
      (await fibonacci(x - 1)) + (await fibonacci(x - 2)) + ""
    );
  }
  return (await fibonacci(x - 1)) + (await fibonacci(x - 2));
}
