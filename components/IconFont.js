import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function IconFont() {
  const router = useRouter()

  useEffect(() => {
    const iconFontScript = '/webfonts/iconfont.js'

    fetch(iconFontScript, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`iconfont not found: ${response.status}`)
        }

        return loadExternalResource(iconFontScript)
      })
      .then(url => {
        console.log('iconfont loaded:', url)

        const iconElements = document.querySelectorAll('i[class*="icon-"]')
        iconElements.forEach(element => {
          const className = Array.from(element.classList).find(classItem =>
            classItem.startsWith('icon-')
          )

          if (!className) {
            return
          }

          const svgElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          )
          svgElement.setAttribute('class', 'icon')
          svgElement.setAttribute('aria-hidden', 'true')

          const useElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'use'
          )
          useElement.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            `#${className}`
          )
          svgElement.appendChild(useElement)

          element.replaceWith(svgElement)
        })
      })
      .catch(error => {
        console.warn('Skip loading iconfont.js:', error)
      })
  }, [router])

  return (
    <style jsx global>{`
      .icon {
        width: 1.1em;
        height: 1.1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }

      svg.icon {
        display: inline;
      }
    `}</style>
  )
}
