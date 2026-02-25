import { cleanCache } from '@/lib/cache/local_file_cache'

/**
 * 清理缓存
 * 需要通过 ?token=<ADMIN_SECRET> 或 Authorization: Bearer <ADMIN_SECRET> 验证
 * ADMIN_SECRET 对应环境变量 CACHE_CLEAN_SECRET
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  // 鉴权保护：只允许配置了 CACHE_CLEAN_SECRET 的请求访问
  const secret = process.env.CACHE_CLEAN_SECRET
  if (secret) {
    const tokenFromQuery = req.query?.token
    const authHeader = req.headers?.authorization
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null
    if (tokenFromQuery !== secret && tokenFromHeader !== secret) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
  }

  try {
    cleanCache()
    res
      .status(200)
      .json({ status: 'success', message: 'Clean cache successful!' })
  } catch (error) {
    res
      .status(400)
      .json({ status: 'error', message: 'Clean cache failed!', error })
  }
}
