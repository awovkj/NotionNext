/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      body {
        background-color: transparent !important;
      }

      /* 确保页面容器透明 */
      #theme-heo, #wrapper-outer, #post-outer-wrapper {
        background-color: transparent !important;
      }

      /* 轮播图区域透明 */
      #hero-main {
        background-color: transparent !important;
      }

      /* 公告栏文字黑色 */
      #theme-heo #announcement-content .notion {
        color: black !important;
      }
      .dark #theme-heo #announcement-content .notion {
        color: white !important;
      }

      /* notion-article 字体白色并调大 */
      #notion-article {
        color: white !important;
        font-size: 1.125rem !important;
      }
      #notion-article * {
        color: white !important;
      }
      .dark #notion-article {
        color: white !important;
      }
      .dark #notion-article * {
        color: white !important;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
        mask-image: linear-gradient(to top, transparent 5%, black 70%);
      }

      .recent-top-post-group::-webkit-scrollbar {
        display: none;
      }

      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      * {
        box-sizing: border-box;
      }

      // 标签滚动动画
      .tags-group-wrapper {
        animation: rowup 60s linear infinite;
      }

      @keyframes rowup {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      #theme-heo #hero-wrapper .recent-post-top {
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
      }

      .heo-home-hero-intro {
        position: relative;
        padding: 0 !important;
        margin: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
      }

      .heo-home-hero-main-bg {
        transform: scale(1.02);
      }

      /* 确保 hero 区域没有顶部空白 */
      .heo-home-hero-intro {
        position: relative;
        padding: 0 !important;
        margin: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
      }

      /* 背景图相关样式 */
      .heo-home-hero-main-bg {
        display: none !important;
      }

      .heo-typing-caret {
        margin-left: 0.2rem;
        animation: heoTypingBlink 1s steps(1) infinite;
      }

      @keyframes heoTypingBlink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }

      @media (max-width: 1024px) {
        #theme-heo #hero-wrapper .heo-home-hero-intro {
          background-attachment: scroll !important;
        }

        #theme-heo #hero-wrapper {
          background-attachment: scroll !important;
        }

        .heo-home-hero-main-bg {
          transform: scale(1.01);
        }
      }
    `}</style>
  )
}

export { Style }
