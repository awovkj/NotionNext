import { APPEARANCE, LANG, NOTION_PAGE_ID, THEME } from '@/blog.config'
import {
  getThemeConfig,
  initDarkMode,
  saveDarkModeToLocalStorage
} from '@/themes/theme'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { generateLocaleDict, initLocale, redirectUserLang } from './utils/lang'

/**
 * 全局上下文
 */
const GlobalContext = createContext()

export function GlobalContextProvider(props) {
  const {
    post,
    children,
    siteInfo,
    categoryOptions,
    tagOptions,
    NOTION_CONFIG
  } = props

  const [lang, updateLang] = useState(NOTION_CONFIG?.LANG || LANG) // 默认语言
  const [locale, updateLocale] = useState(
    generateLocaleDict(NOTION_CONFIG?.LANG || LANG)
  ) // 默认语言
  const [theme, setTheme] = useState(NOTION_CONFIG?.THEME || THEME) // 默认博客主题
  const [THEME_CONFIG, SET_THEME_CONFIG] = useState(null) // 主题配置
  const [isLiteMode, setLiteMode] = useState(false)

  const defaultDarkMode = NOTION_CONFIG?.APPEARANCE || APPEARANCE
  const [isDarkMode, updateDarkMode] = useState(defaultDarkMode === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据
  const router = useRouter()

  const enableClerk =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    process.env.ANALYZE !== 'true'
  const { isLoaded, isSignedIn, user } = enableClerk
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useUser()
    : { isLoaded: true, isSignedIn: false, user: false }
  // 是否全屏
  const fullWidth = post?.fullWidth ?? false

  // 抓取主题配置
  const updateThemeConfig = useCallback(async theme => {
    const config = await getThemeConfig(theme)
    SET_THEME_CONFIG(config)
  }, [])

  // 切换深色模式 - useCallback 避免 Context 消贵者不必要的重渲染
  const toggleDarkMode = useCallback(() => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.documentElement
    htmlElement.classList.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList.add(newStatus ? 'dark' : 'light')
  }, [isDarkMode])

  const changeLang = useCallback(lang => {
    if (lang) {
      updateLang(lang)
      updateLocale(generateLocaleDict(lang))
    }
  }, [])

  // 路由变化时的语言处理 - 依赖 router.locale 而非整个 router 对象
  const routerLocale = router.locale
  useEffect(() => {
    initLocale(routerLocale, changeLang, updateLocale)
    if (router.query.lite === 'true') {
      setLiteMode(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocale])

  // 首次加载成功
  useEffect(() => {
    initDarkMode(updateDarkMode, defaultDarkMode)
    // 处理多语言自动重定向
    if (
      NOTION_CONFIG?.REDIRECT_LANG &&
      JSON.parse(NOTION_CONFIG?.REDIRECT_LANG)
    ) {
      redirectUserLang(NOTION_PAGE_ID)
    }
    setOnLoading(false)
  }, [NOTION_CONFIG?.REDIRECT_LANG, defaultDarkMode])

  useEffect(() => {
    const events = router.events
    const handleStart = () => setOnLoading(true)
    const handleStop = () => setOnLoading(false)
    events.on('routeChangeStart', handleStart)
    events.on('routeChangeError', handleStop)
    events.on('routeChangeComplete', handleStop)
    return () => {
      events.off('routeChangeStart', handleStart)
      events.off('routeChangeComplete', handleStop)
      events.off('routeChangeError', handleStop)
    }
    // router.events 是稳定引用，只需挂载一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateThemeConfig(theme)
  }, [theme, updateThemeConfig])

  const contextValue = useMemo(
    () => ({
      isLiteMode,
      isLoaded,
      isSignedIn,
      user,
      fullWidth,
      NOTION_CONFIG,
      THEME_CONFIG,
      toggleDarkMode,
      onLoading,
      setOnLoading,
      lang,
      changeLang,
      locale,
      updateLocale,
      isDarkMode,
      updateDarkMode,
      theme,
      setTheme,
      siteInfo,
      categoryOptions,
      tagOptions
    }),
    [
      isLiteMode,
      isLoaded,
      isSignedIn,
      user,
      fullWidth,
      NOTION_CONFIG,
      THEME_CONFIG,
      toggleDarkMode,
      onLoading,
      lang,
      changeLang,
      locale,
      isDarkMode,
      theme,
      siteInfo,
      categoryOptions,
      tagOptions
    ]
  )

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
