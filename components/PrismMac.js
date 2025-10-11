import { useEffect } from 'react'
import Prism from 'prismjs'
// 所有语言的prismjs 使用autoloader引入
// import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
// 禁用show-language插件以避免显示语言标签
// import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// mermaid图
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'

/**
 * 代码美化相关
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const codeMacBar = siteConfig('CODE_MAC_BAR')
  const prismjsAutoLoader = siteConfig('PRISM_JS_AUTO_LOADER')
  const prismjsPath = siteConfig('PRISM_JS_PATH')

  const prismThemeSwitch = siteConfig('PRISM_THEME_SWITCH')
  const prismThemeDarkPath = siteConfig('PRISM_THEME_DARK_PATH')
  const prismThemeLightPath = siteConfig('PRISM_THEME_LIGHT_PATH')
  const prismThemePrefixPath = siteConfig('PRISM_THEME_PREFIX_PATH')

  const mermaidCDN = siteConfig('MERMAID_CDN')
  const codeLineNumbers = siteConfig('CODE_LINE_NUMBERS')

  const codeCollapse = siteConfig('CODE_COLLAPSE')
  const codeCollapseExpandDefault = siteConfig('CODE_COLLAPSE_EXPAND_DEFAULT')

  useEffect(() => {
    if (codeMacBar) {
      loadExternalResource('/css/prism-mac-style.css', 'css')
    }
    // 加载prism样式
    loadPrismThemeCSS(
      isDarkMode,
      prismThemeSwitch,
      prismThemeDarkPath,
      prismThemeLightPath,
      prismThemePrefixPath
    )
    // 折叠代码
    loadExternalResource(prismjsAutoLoader, 'js').then(url => {
      if (window?.Prism?.plugins?.autoloader) {
        window.Prism.plugins.autoloader.languages_path = prismjsPath
      }

      renderPrismMac(codeLineNumbers)
      renderMermaid(mermaidCDN)
      renderCollapseCode(codeCollapse, codeCollapseExpandDefault)
    })
  }, [router, isDarkMode])

  return <></>
}

/**
 * 加载Prism主题样式
 */
const loadPrismThemeCSS = (
  isDarkMode,
  prismThemeSwitch,
  prismThemeDarkPath,
  prismThemeLightPath,
  prismThemePrefixPath
) => {
  let PRISM_THEME
  let PRISM_PREVIOUS
  if (prismThemeSwitch) {
    if (isDarkMode) {
      PRISM_THEME = prismThemeDarkPath
      PRISM_PREVIOUS = prismThemeLightPath
    } else {
      PRISM_THEME = prismThemeLightPath
      PRISM_PREVIOUS = prismThemeDarkPath
    }
    const previousTheme = document.querySelector(
      `link[href="${PRISM_PREVIOUS}"]`
    )
    if (
      previousTheme &&
      previousTheme.parentNode &&
      previousTheme.parentNode.contains(previousTheme)
    ) {
      previousTheme.parentNode.removeChild(previousTheme)
    }
    loadExternalResource(PRISM_THEME, 'css')
  } else {
    loadExternalResource(prismThemePrefixPath, 'css')
  }
}

/**
 * 将代码块转为可折叠对象
 */
const renderCollapseCode = (codeCollapse, codeCollapseExpandDefault) => {
  if (!codeCollapse) {
    return
  }
  
  const codeBlocks = document.querySelectorAll('.code-toolbar')
  if (!codeBlocks.length) {
    return
  }

  const fragment = document.createDocumentFragment()
  
  for (const codeBlock of codeBlocks) {
    try {
      // 判断当前元素是否已被包裹
      if (codeBlock.closest('.collapse-wrapper')) {
        continue
      }

      const code = codeBlock.querySelector('code')
      if (!code) continue
      
      const classMatch = code.getAttribute('class')?.match(/language-(\w+)/)
      const language = classMatch ? classMatch[1] : 'code'

      // 创建折叠结构
      const collapseWrapper = document.createElement('div')
      collapseWrapper.className = 'collapse-wrapper w-full py-2'
      
      const panelWrapper = document.createElement('div')
      panelWrapper.className =
        'border dark:border-gray-600 rounded-md hover:border-indigo-500 duration-200 transition-colors'

      const header = document.createElement('div')
      header.className =
        'flex justify-between items-center px-4 py-2 cursor-pointer select-none'
      header.innerHTML = `<h3 class="text-lg font-medium">${language}</h3><svg class="transition-all duration-200 w-5 h-5 transform rotate-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/></svg>`

      const panel = document.createElement('div')
      panel.className =
        'invisible h-0 transition-transform duration-200 border-t border-gray-300'

      // 组装DOM结构
      panelWrapper.appendChild(header)
      panelWrapper.appendChild(panel)
      collapseWrapper.appendChild(panelWrapper)

      // 插入到DOM
      const parent = codeBlock.parentNode
      if (parent) {
        parent.insertBefore(collapseWrapper, codeBlock)
        panel.appendChild(codeBlock)

        // 折叠切换函数
        const collapseCode = () => {
          panel.classList.toggle('invisible')
          panel.classList.toggle('h-0')
          panel.classList.toggle('h-auto')
          const svg = header.querySelector('svg')
          if (svg) {
            svg.classList.toggle('rotate-180')
          }
          panelWrapper.classList.toggle('border-gray-300')
        }

        // 添加点击事件
        header.addEventListener('click', collapseCode, { passive: true })
        
        // 是否自动展开
        if (codeCollapseExpandDefault) {
          requestAnimationFrame(() => {
            header.click()
          })
        }
      }
    } catch (err) {
      console.warn('折叠代码块失败:', err)
    }
  }
}

/**
 * 将mermaid语言 渲染成图片
 */
const renderMermaid = mermaidCDN => {
  const observer = new MutationObserver(mutationsList => {
    for (const m of mutationsList) {
      if (m.target.className === 'notion-code language-mermaid') {
        const chart = m.target.querySelector('code').textContent
        if (chart && !m.target.querySelector('.mermaid')) {
          const mermaidChart = document.createElement('pre')
          mermaidChart.className = 'mermaid'
          mermaidChart.innerHTML = chart
          m.target.appendChild(mermaidChart)
        }

        const mermaidsSvg = document.querySelectorAll('.mermaid')
        if (mermaidsSvg) {
          let needLoad = false
          for (const e of mermaidsSvg) {
            if (e?.firstChild?.nodeName !== 'svg') {
              needLoad = true
            }
          }
          if (needLoad) {
            loadExternalResource(mermaidCDN, 'js').then(url => {
              setTimeout(() => {
                const mermaid = window.mermaid
                mermaid?.contentLoaded()
              }, 100)
            })
          }
        }
      }
    }
  })
  if (document.querySelector('#notion-article')) {
    observer.observe(document.querySelector('#notion-article'), {
      attributes: true,
      subtree: true
    })
  }
}

/**
 * 渲染PrismMac样式
 */
function renderPrismMac(codeLineNumbers) {
  const container = document?.getElementById('notion-article')
  if (!container) {
    console.warn('未找到 #notion-article 容器')
    return
  }

  // 添加行号
  if (codeLineNumbers) {
    const codeBlocks = container.getElementsByTagName('pre')
    if (codeBlocks && codeBlocks.length > 0) {
      Array.from(codeBlocks).forEach(item => {
        if (!item.classList.contains('line-numbers')) {
          item.classList.add('line-numbers')
          item.style.whiteSpace = 'pre-wrap'
        }
      })
    }
  }

  // 高亮代码
  try {
    if (typeof Prism !== 'undefined' && Prism.highlightAll) {
      Prism.highlightAll()
    }
  } catch (err) {
    console.warn('代码高亮失败:', err)
  }

  // 添加Mac风格标题栏
  const codeToolBars = container.getElementsByClassName('code-toolbar')
  if (codeToolBars && codeToolBars.length > 0) {
    Array.from(codeToolBars).forEach(item => {
      try {
        const existPreMac = item.getElementsByClassName('pre-mac')
        if (existPreMac.length === 0) {
          const preMac = document.createElement('div')
          preMac.className = 'pre-mac'
          preMac.innerHTML = '<span></span><span></span><span></span>'
          item.appendChild(preMac)
        }
      } catch (err) {
        console.warn('添加Mac标题栏失败:', err)
      }
    })
  }

  // 修复行号样式bug
  if (codeLineNumbers) {
    fixCodeLineStyle()
  }
}

/**
 * 行号样式在首次渲染或被detail折叠后行高判断错误
 * 在此手动resize计算
 */
const fixCodeLineStyle = () => {
  const article = document.querySelector('#notion-article')
  if (!article) {
    return
  }

  const observer = new MutationObserver(mutationsList => {
    for (const m of mutationsList) {
      if (m.target.nodeName === 'DETAILS') {
        const preCodes = m.target.querySelectorAll('pre.notion-code')
        for (const preCode of preCodes) {
          try {
            if (Prism?.plugins?.lineNumbers?.resize) {
              Prism.plugins.lineNumbers.resize(preCode)
            }
          } catch (err) {
            console.warn('行号调整失败:', err)
          }
        }
      }
    }
  })
  
  observer.observe(article, {
    attributes: true,
    subtree: true
  })

  // 初始化时调整行号
  requestAnimationFrame(() => {
    const preCodes = document.querySelectorAll('pre.notion-code')
    for (const preCode of preCodes) {
      try {
        if (Prism?.plugins?.lineNumbers?.resize) {
          Prism.plugins.lineNumbers.resize(preCode)
        }
      } catch (err) {
        console.warn('行号初始化失败:', err)
      }
    }
  })
}

export default PrismMac
