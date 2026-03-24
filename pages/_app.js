// import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/utility-patterns.css'

// core styles shared by all of react-notion-x (required)
import '@/styles/notion.css' //  重写部分notion样式
import 'react-notion-x/src/styles.css' // 原版的react-notion-x

import useAdjustStyle from '@/hooks/useAdjustStyle'
import { GlobalContextProvider } from '@/lib/global'
import { getBaseLayoutByTheme } from '@/themes/theme'
import { useCallback, useMemo } from 'react'

// 各种扩展插件 这个要阻塞引入
import BLOG from '@/blog.config'
import ExternalPlugins from '@/components/ExternalPlugins'
import SEO from '@/components/SEO'
import localFont from 'next/font/local'
import dynamic from 'next/dynamic'
// ClerkProvider 与 zhCN 一起延迟加载，未启用 Clerk 时不打包
const LazyClerkProvider = dynamic(() =>
  Promise.all([
    import('@clerk/nextjs'),
    import('@clerk/localizations')
  ]).then(([clerk, loc]) => {
    const { ClerkProvider } = clerk
    const { zhCN } = loc
    // 返回一个包装组件
    const Wrapper = ({ children }) => (
      <ClerkProvider localization={zhCN}>{children}</ClerkProvider>
    )
    Wrapper.displayName = 'ClerkProviderWrapper'
    return { default: Wrapper }
  })
)

const hhhFont = localFont({
  src: '../hhh.ttf',
  display: 'swap',
  variable: '--font-hhh'
})

/**
 * App挂载DOM 入口文件
 * @param {*} param0
 * @returns
 */
const MyApp = ({ Component, pageProps }) => {
  // 一些可能出现 bug 的样式，可以统一放入该钩子进行调整
  useAdjustStyle()

  const theme = useMemo(() => {
    return pageProps?.NOTION_CONFIG?.THEME || BLOG.THEME
  }, [pageProps?.NOTION_CONFIG?.THEME])

  // 整体布局
  const GLayout = useCallback(
    props => {
      const Layout = getBaseLayoutByTheme(theme)
      return <Layout {...props} />
    },
    [theme]
  )

  const enableClerk =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.ANALYZE !== 'true'
  const content = (
    <div className={`${hhhFont.className} ${hhhFont.variable}`}>
      <GlobalContextProvider {...pageProps}>
        <GLayout {...pageProps}>
          <SEO {...pageProps} />
          <Component {...pageProps} />
        </GLayout>
        <ExternalPlugins {...pageProps} />
      </GlobalContextProvider>
    </div>
  )
  return (
    <>
      {enableClerk ? (
        <LazyClerkProvider>{content}</LazyClerkProvider>
      ) : (
        content
      )}
    </>
  )
}

export default MyApp
