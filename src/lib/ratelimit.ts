import { redis } from "@/lib/redis"

type RateLimitResult = {
  limit: number
  remaining: number
  success: boolean
  reset: number
}

interface rateLimiterParams {
  ip: string
  endpoint: string
  limit?: number
  window?: number
}

export async function rateLimiter(
  params: rateLimiterParams
): Promise<RateLimitResult> {
  const { ip, endpoint, limit = 3, window = 60 * 1000 } = params

  const key = `ratelimit:${ip}:${endpoint}`

  const currentCount = await redis.get(key)
  const count = parseInt(currentCount as string, 10) ?? 0

  const ttl = await redis.ttl(key)

  if (count >= limit) {
    const reset = Date.now() + (ttl > 0 ? ttl * 1000 : window)

    return {
      limit,
      remaining: 0,
      reset,
      success: false,
    }
  }

  if (count === 0) {
    await redis.set(key, 1, "PX", window)
  } else {
    await redis.incr(key)
  }

  const newTtl = await redis.ttl(key)
  const reset = Date.now() + (newTtl > 0 ? newTtl * 1000 : window)

  return {
    limit,
    remaining: limit - (count + 1),
    reset,
    success: true,
  }
}
