import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 加载滚动动画
 * 改从外部CDN读取
 * https://michalsnik.github.io/aos/
 */
export default function AOSAnimation() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const hasAosElement = () => Boolean(document.querySelector('[data-aos]'))
    if (!hasAosElement()) {
      return
    }

    let cancelled = false
    const schedule = window.requestIdleCallback || window.setTimeout
    const cancel = window.cancelIdleCallback || window.clearTimeout

    const taskId = schedule(() => {
      if (!hasAosElement()) {
        return
      }

      Promise.all([
        loadExternalResource('/js/aos.js', 'js'),
        loadExternalResource('/css/aos.css', 'css')
      ]).then(() => {
        if (!cancelled && window.AOS) {
          window.AOS.init()
        }
      })
    }, 1)

    return () => {
      cancelled = true
      cancel(taskId)
    }
  }, [])

  return null
}
