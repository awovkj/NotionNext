import { cleanCache } from '@/lib/cache/local_file_cache'

/**
 * 清理缓存
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
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
