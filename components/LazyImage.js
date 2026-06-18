import { siteConfig } from '@/lib/config'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

let imageQueue = []
let activeLoads = 0
let scheduleId = null
let sequence = 0
const loadedImageSrcs = new Set()
const MAX_CACHE_SIZE = 500

const isBrowser = () => typeof window !== 'undefined'

const rememberLoaded = src => {
  loadedImageSrcs.add(src)

  if (loadedImageSrcs.size > MAX_CACHE_SIZE) {
    const first = loadedImageSrcs.values().next().value
    loadedImageSrcs.delete(first)
  }
}

const getImageLoadConcurrency = () => {
  const value = Number(siteConfig('IMAGE_LOAD_CONCURRENCY', 2))

  if (!Number.isFinite(value) || value < 1) {
    return 2
  }

  return Math.min(Math.floor(value), 4)
}

const getQueueItemTop = item => {
  if (!isBrowser()) {
    return 0
  }

  const element = item.element()
  if (!element) {
    return Number.MAX_SAFE_INTEGER
  }

  return element.getBoundingClientRect().top + window.scrollY
}

const sortImageQueue = () => {
  imageQueue.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority ? -1 : 1
    }

    const topDiff = getQueueItemTop(a) - getQueueItemTop(b)
    if (topDiff !== 0) {
      return topDiff
    }

    return a.order - b.order
  })
}

const scheduleImageQueue = () => {
  if (!isBrowser() || scheduleId !== null) {
    return
  }

  scheduleId = window.requestAnimationFrame(drainImageQueue)
}

const drainImageQueue = () => {
  scheduleId = null

  if (!isBrowser()) {
    return
  }

  imageQueue = imageQueue.filter(item => !item.cancelled)
  sortImageQueue()

  const maxConcurrentLoads = getImageLoadConcurrency()

  while (activeLoads < maxConcurrentLoads && imageQueue.length > 0) {
    const item = imageQueue.shift()

    if (!item || item.cancelled) {
      continue
    }

    activeLoads += 1

    item
      .load()
      .catch(() => {})
      .finally(() => {
        activeLoads -= 1
        scheduleImageQueue()
      })
  }
}

const enqueueImageLoad = item => {
  imageQueue.push(item)
  scheduleImageQueue()

  return () => {
    item.cancelled = true
    imageQueue = imageQueue.filter(queueItem => queueItem.id !== item.id)
  }
}

export default function LazyImage({
  priority,
  id,
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  title,
  onLoad,
  onClick,
  style
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH')
  const defaultPlaceholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  const imageRef = useRef(null)
  const [currentSrc, setCurrentSrc] = useState(
    placeholderSrc || defaultPlaceholderSrc
  )
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src) {
      return
    }

    const adjustedImageSrc =
      adjustImgSize(src, maxWidth) || defaultPlaceholderSrc
    const fallbackSrc = placeholderSrc || defaultPlaceholderSrc
    const taskId = `${Date.now()}-${sequence++}`
    let cancelled = false

    setCurrentSrc(fallbackSrc)
    setIsLoaded(false)

    const markLoaded = nextSrc => {
      if (cancelled) {
        return
      }

      setCurrentSrc(nextSrc)
      setIsLoaded(true)

      if (typeof onLoad === 'function') {
        onLoad()
      }

      if (imageRef.current) {
        imageRef.current.classList.remove('lazy-image-placeholder')
      }
    }

    if (loadedImageSrcs.has(adjustedImageSrc)) {
      markLoaded(adjustedImageSrc)
      return
    }

    const load = () => {
      return new Promise(resolve => {
        if (cancelled || !isBrowser()) {
          resolve()
          return
        }

        const img = new Image()
        if ('decoding' in img) {
          img.decoding = 'async'
        }
        if ('fetchPriority' in img) {
          img.fetchPriority = priority ? 'high' : 'auto'
        }

        img.onload = () => {
          rememberLoaded(adjustedImageSrc)
          markLoaded(adjustedImageSrc)
          resolve()
        }

        img.onerror = () => {
          markLoaded(fallbackSrc)
          resolve()
        }

        img.src = adjustedImageSrc
      })
    }

    const cancelQueueItem = enqueueImageLoad({
      id: taskId,
      order: sequence,
      priority: Boolean(priority),
      cancelled: false,
      element: () => imageRef.current,
      load
    })

    return () => {
      cancelled = true
      cancelQueueItem()
    }
  }, [src, maxWidth, priority, defaultPlaceholderSrc, placeholderSrc, onLoad])

  if (!src) {
    return null
  }

  const imgProps = {
    ref: imageRef,
    src: currentSrc,
    'data-src': src,
    alt: alt || 'Lazy loaded image',
    onError: () => {
      setCurrentSrc(placeholderSrc || defaultPlaceholderSrc)
      setIsLoaded(true)
    },
    className: `${className || ''}${isLoaded ? '' : ' lazy-image-placeholder'}`,
    style,
    width: width || 'auto',
    height: height || 'auto',
    onClick,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    ...(priority && { fetchPriority: 'high' }),
    ...(siteConfig('WEBP_SUPPORT') && { 'data-webp': true }),
    ...(siteConfig('AVIF_SUPPORT') && { 'data-avif': true })
  }

  if (id) imgProps.id = id
  if (title) imgProps.title = title

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} />
      {priority && (
        <Head>
          <link rel='preload' as='image' href={adjustImgSize(src, maxWidth)} />
        </Head>
      )}
    </>
  )
}

const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return null
  }

  const imageSrc = String(src)
  const screenWidth =
    (typeof window !== 'undefined' && window?.screen?.width) || maxWidth

  if (!maxWidth || screenWidth > maxWidth) {
    return imageSrc
  }

  const widthRegex = /width=\d+/
  const wRegex = /w=\d+/

  return imageSrc
    .replace(widthRegex, `width=${screenWidth}`)
    .replace(wRegex, `w=${screenWidth}`)
}
