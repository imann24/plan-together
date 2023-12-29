import { createClient, RedisClientType } from 'redis'

// optionally initialize client if connection string is provided
let redis: RedisClientType, cacheExists = false

if (process.env.REDIS_CONNECTION_STRING) {
    redis = createClient({
        url: process.env.REDIS_CONNECTION_STRING,
    })
    redis.connect()
    cacheExists = true
}

export async function cacheGet(key: string): Promise<string | null> {
    if (!cacheExists) {
        return null
    }

    return await redis.get(key)
}

export async function cacheSet(key: string, value: string, ttl: number=60): Promise<void> {
    if (!cacheExists) {
        return
    }

    await redis.set(key, value)
    await redis.expire(key, ttl)
}
