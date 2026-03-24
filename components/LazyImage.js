import { siteConfig } from '@/lib/config'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

/**
 * 共享 IntersectionObserver 单例，所有 LazyImage 实例复用同一个 observer
 * 避免每个图片创建独立 observer 浪费内存
 */
let sharedObserver = null
const observerCallbacks = new Map()

function getSharedObserver() {
  if (sharedObserver) return sharedObserver
  if (typeof window === 'undefined' || !window.IntersectionObserver)
    return null

  sharedObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const callback = observerCallbacks.get(entry.target)
          if (callback) {
            callback()
            observerCallbacks.delete(entry.target)
            sharedObserver.unobserve(entry.target)
          }
        }
      })
    },
    {
      rootMargin: siteConfig('LAZY_LOAD_THRESHOLD', '200px'),
      threshold: 0.1
    }
  )
  return sharedObserver
}

/**
 * 图片懒加载
 * @param {*} param0
 * @returns
 */
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

  /**
   * 占位图加载成功
   */
  const handleThumbnailLoaded = () => {
    if (typeof onLoad === 'function') {
      // onLoad() // 触发传递的onLoad回调函数
    }
  }
  // 原图加载完成
  const handleImageLoaded = img => {
    if (typeof onLoad === 'function') {
      onLoad() // 触发传递的onLoad回调函数
    }
    // 移除占位符类名
    if (imageRef.current) {
      imageRef.current.classList.remove('lazy-image-placeholder')
    }
  }
  /**
   * 图片加载失败回调
   */
  const handleImageError = () => {
    if (imageRef.current) {
      // 尝试加载 placeholderSrc，如果失败则加载 defaultPlaceholderSrc
      if (imageRef.current.src !== placeholderSrc && placeholderSrc) {
        imageRef.current.src = placeholderSrc
      } else {
        imageRef.current.src = defaultPlaceholderSrc
      }
      // 移除占位符类名
      if (imageRef.current) {
        imageRef.current.classList.remove('lazy-image-placeholder')
      }
    }
  }

  useEffect(() => {
    const adjustedImageSrc =
      adjustImgSize(src, maxWidth) || defaultPlaceholderSrc

    const loadImage = () => {
      const img = new Image()
      if ('decoding' in img) img.decoding = 'async'
      img.src = adjustedImageSrc
      img.onload = () => {
        setCurrentSrc(adjustedImageSrc)
        handleImageLoaded(adjustedImageSrc)
      }
      img.onerror = handleImageError
    }

    // 如果是优先级图片，直接加载
    if (priority) {
      loadImage()
      return
    }

    const observer = getSharedObserver()
    // 降级处理：不支持 IntersectionObserver 则直接加载
    if (!observer) {
      loadImage()
      return
    }

    const el = imageRef.current
    if (el) {
      observerCallbacks.set(el, loadImage)
      observer.observe(el)
    }

    return () => {
      if (el) {
        observerCallbacks.delete(el)
        observer.unobserve(el)
      }
    }
  }, [src, maxWidth, priority])

  // 动态添加width、height和className属性，仅在它们为有效值时添加
  const imgProps = {
    ref: imageRef,
    src: currentSrc,
    'data-src': src, // 存储原始图片地址
    alt: alt || 'Lazy loaded image',
    onLoad: handleThumbnailLoaded,
    onError: handleImageError,
    className: `${className || ''} lazy-image-placeholder`,
    style,
    width: width || 'auto',
    height: height || 'auto',
    onClick,
    // 性能优化属性
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    // 现代图片格式支持
    ...(siteConfig('WEBP_SUPPORT') && { 'data-webp': true }),
    ...(siteConfig('AVIF_SUPPORT') && { 'data-avif': true })
  }

  if (id) imgProps.id = id
  if (title) imgProps.title = title

  if (!src) {
    return null
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} />
      {/* 预加载 */}
      {priority && (
        <Head>
          <link rel='preload' as='image' href={adjustImgSize(src, maxWidth)} />
        </Head>
      )}
    </>
  )
}

/**
 * 根据窗口尺寸决定压缩图片宽度
 * @param {*} src
 * @param {*} maxWidth
 * @returns
 */
const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return null
  }
  const screenWidth =
    (typeof window !== 'undefined' && window?.screen?.width) || maxWidth

  // 屏幕尺寸大于默认图片尺寸，没必要再压缩
  if (screenWidth > maxWidth) {
    return src
  }

  // 正则表达式，用于匹配 URL 中的 width 参数
  const widthRegex = /width=\d+/
  // 正则表达式，用于匹配 URL 中的 w 参数
  const wRegex = /w=\d+/

  // 使用正则表达式替换 width/w 参数
  return src
    .replace(widthRegex, `width=${screenWidth}`)
    .replace(wRegex, `w=${screenWidth}`)
}
