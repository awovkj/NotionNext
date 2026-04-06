'use client'

import { isBrowser } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 自定义外部 script
 * 传入参数将转为 <script>标签。
 * @returns
 */
const ExternalScript = props => {
  const { src } = props

  useEffect(() => {
    if (!isBrowser || !src) {
      return
    }

    const element = document.querySelector(`script[src="${src}"]`)
    if (element) {
      return
    }

    const script = document.createElement('script')
    Object.entries(props).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })
    document.head.appendChild(script)
  }, [props, src])

  return null
}

export default ExternalScript
