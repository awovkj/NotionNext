import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'

// 配置是否开启Vercel环境中的缓存；
// Memory/File 缓存在 Vercel serverless 环境中无意义（每次请求新实例），仅 build/export 阶段或非 prod 环境才允许写入。
// Redis 缓存不受此限制，由 getApi() 选择逻辑保障。
const enableMemoryOrFileCacheWrite =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export' ||
  !BLOG['isProd']

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并写入缓存，最终返回所需数据
 * @param key
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCache(
  key,
  getDataFunction,
  ...getDataArgs
) {
  return getOrSetDataWithCustomCache(key, null, getDataFunction, ...getDataArgs)
}

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并自定义写入缓存，最终返回所需数据
 * @param key
 * @param customCacheTime
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCustomCache(
  key,
  customCacheTime,
  getDataFunction,
  ...getDataArgs
) {
  const dataFromCache = await getDataFromCache(key)
  if (dataFromCache) {
    // console.log('[缓存-->>API]:', key) // 避免过多的缓存日志输出
    return dataFromCache
  }
  const data = await getDataFunction(...getDataArgs)
  if (data) {
    // console.log('[API-->>缓存]:', key)
    await setDataToCache(key, data, customCacheTime)
  }
  return data || null
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (JSON.parse(BLOG.ENABLE_CACHE) || force) {
    const dataFromCache = await getApi().getCache(key)
    if (!dataFromCache || JSON.stringify(dataFromCache) === '[]') {
      return null
    }
    // console.trace('[API-->>缓存]:', key, dataFromCache)
    return dataFromCache
  } else {
    return null
  }
}

/**
 * 写入缓存
 * @param {*} key
 * @param {*} data
 * @param {*} customCacheTime
 * @returns
 */
export async function setDataToCache(key, data, customCacheTime) {
  if (!data) return
  // Redis 缓存始终允许写入（跨请求持久化）
  // Memory/File 缓存仅在非-Vercel-生产环境或构建阶段允许写入
  const api = getApi()
  const isRedis = BLOG.REDIS_URL
  if (!isRedis && !enableMemoryOrFileCacheWrite) {
    return
  }
  //   console.trace('[API-->>缓存写入]:', key)
  await api.setCache(key, data, customCacheTime)
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) {
    return
  }
  await getApi().delCache(key)
}

/**
 * 缓存实现类
 * @returns
 */
export function getApi() {
  if (BLOG.REDIS_URL) {
    return RedisCache
  } else if (process.env.ENABLE_FILE_CACHE) {
    return FileCache
  } else {
    return MemoryCache
  }
}
