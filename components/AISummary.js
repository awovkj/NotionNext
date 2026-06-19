import styles from './AISummary.module.css'
import { useEffect, useRef, useState } from 'react'
import { useGlobal } from '@/lib/global'

const AISummary = ({ aiSummary }) => {
  const { locale } = useGlobal()
  const containerRef = useRef(null)
  const [summary, setSummary] = useState('')

  useEffect(() => {
    if (!aiSummary) {
      setSummary('')
      return
    }

    if (
      typeof window === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setSummary(aiSummary)
      return
    }

    let currentIndex = 0
    let isVisible = false
    let timerId = null
    let frameId = null
    let observer = null
    let cancelled = false

    setSummary('')

    const clearPendingWork = () => {
      if (timerId !== null) {
        window.clearTimeout(timerId)
        timerId = null
      }
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    const getDelay = char => {
      return /[，。！？、；：,.!?;:]/.test(char) ? 110 : 22
    }

    const scheduleNextFrame = delay => {
      clearPendingWork()
      timerId = window.setTimeout(() => {
        timerId = null
        frameId = window.requestAnimationFrame(typeNextChar)
      }, delay)
    }

    const typeNextChar = () => {
      frameId = null

      if (cancelled || !isVisible) {
        return
      }

      if (currentIndex >= aiSummary.length) {
        setSummary(aiSummary)
        observer?.disconnect()
        return
      }

      currentIndex += 1
      setSummary(aiSummary.slice(0, currentIndex))
      scheduleNextFrame(getDelay(aiSummary[currentIndex - 1]))
    }

    const startOrResume = (delay = 0) => {
      if (cancelled || currentIndex >= aiSummary.length) {
        return
      }

      scheduleNextFrame(delay)
    }

    const target = containerRef.current
    if (!target || !window.IntersectionObserver) {
      isVisible = true
      startOrResume(120)
    } else {
      observer = new IntersectionObserver(
        entries => {
          isVisible = Boolean(entries[0]?.isIntersecting)

          if (isVisible) {
            startOrResume(currentIndex === 0 ? 160 : 0)
          } else {
            clearPendingWork()
          }
        },
        {
          rootMargin: '80px 0px',
          threshold: 0.1
        }
      )
      observer.observe(target)
    }

    return () => {
      cancelled = true
      clearPendingWork()
      observer?.disconnect()
    }
  }, [aiSummary])

  return (
    aiSummary && (
      <div ref={containerRef} className={styles['post-ai']}>
        <div className={styles['ai-container']}>
          <div className={styles['ai-header']}>
            <div className={styles['ai-icon']}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'>
                <path
                  fill='#ffffff'
                  d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z'
                />
              </svg>
            </div>
            <div className={styles['ai-title']}>{locale.AI_SUMMARY.NAME}</div>
            <div className={styles['ai-tag']}>GPT</div>
          </div>
          <div className={styles['ai-content']}>
            <div className={styles['ai-explanation']}>
              {summary}
              {summary !== aiSummary && (
                <span className={styles['blinking-cursor']}></span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default AISummary
