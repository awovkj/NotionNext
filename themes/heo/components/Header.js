import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'

/**
 * 页头：顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const { forceHideOnHome = false } = props
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const router = useRouter()
  const slideOverRef = useRef()

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
  }

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    let prevScrollY = window.scrollY
    let ticking = false

    const updateHeader = throttle(() => {
      const currentScrollY = window.scrollY
      const isAtTop = currentScrollY <= 1
      const hasPostBg = Boolean(document?.querySelector('#post-bg'))

      if (isAtTop) {
        setFixedNav(hasPostBg)
        setBgWhite(false)
        setTextWhite(hasPostBg)
      } else {
        setFixedNav(true)
        setTextWhite(false)
        setBgWhite(true)
      }

      setActiveIndex(currentScrollY > prevScrollY ? 1 : 0)
      prevScrollY = currentScrollY
    }, 100)

    const handleScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(() => {
        updateHeader()
        ticking = false
      })
    }

    updateHeader()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      updateHeader.cancel()
    }
  }, [router.asPath])

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0.5;
            transform: translateY(-30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0.5;
            transform: translateY(30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-down {
          animation: fade-in-down 0.3s ease-in-out;
        }

        .fade-in-up {
          animation: fade-in-up 0.3s ease-in-out;
        }
      `}</style>

      {/* fixed时留白高度 */}
      {fixedNav && !forceHideOnHome && !document?.querySelector('#post-bg') && (
        <div className='h-16'></div>
      )}

      {/* 顶部导航菜单栏 */}
      <nav
        id='nav'
        className={`z-20 h-16 top-0 w-full duration-300 transition-all
            ${fixedNav ? 'fixed' : 'relative'} 
            ${textWhite ? 'text-white ' : 'text-black dark:text-white'}  
            bg-white dark:bg-[#18171d] shadow
            ${forceHideOnHome ? ' opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        <div className='flex h-full mx-auto justify-between items-center max-w-[86rem] px-6'>
          {/* 左侧logo */}
          <Logo {...props} />

          {/* 中间菜单 */}
          <div
            id='nav-bar-swipe'
            className={`hidden lg:flex flex-grow flex-col items-center justify-center h-full relative w-full`}
          >
            <div className='opacity-100'>
              <MenuListTop {...props} />
            </div>
          </div>

          {/* 右侧固定 */}
          <div className='flex flex-shrink-0 justify-end items-center w-48'>
            <RandomPostButton {...props} />
            <SearchButton {...props} />
            <div className='hidden md:block'>
              <DarkModeButton {...props} />
            </div>
            <ReadingProgress />

            {/* 移动端菜单按钮 */}
            <div
              onClick={toggleMenuOpen}
              className='flex lg:hidden w-8 justify-center items-center h-8 cursor-pointer'
            >
              <i className='fas fa-bars' />
            </div>
          </div>

          {/* 右边侧拉抽屉 */}
          <SlideOver cRef={slideOverRef} {...props} />
        </div>
      </nav>
    </>
  )
}

export default Header
