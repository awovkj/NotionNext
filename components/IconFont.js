import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

let iconFontPromise = null

function replaceIconNodes() {
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
}

export default function IconFont() {
  const router = useRouter()

  useEffect(() => {
    const iconFontScript = '/webfonts/iconfont.js'

    iconFontPromise = iconFontPromise || loadExternalResource(iconFontScript)

    iconFontPromise
      .then(() => {
        replaceIconNodes()
      })
      .catch(error => {
        console.warn('Skip loading iconfont.js:', error)
      })
  }, [router.asPath])

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
