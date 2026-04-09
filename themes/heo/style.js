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
        background-image: url('https://tutu.510517.xyz/202508142116968.png');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-attachment: fixed;
      }

      /* 确保页面容器透明 */
      #theme-heo,
      #wrapper-outer,
      #post-outer-wrapper {
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

      /* notion-article 正文字体默认黑色并调大 */
      #notion-article {
        color: black !important;
        font-size: 1.125rem !important;
      }
      #notion-article .notion-text,
      #notion-article .notion-text *,
      #notion-article .notion-h1,
      #notion-article .notion-h1 *,
      #notion-article .notion-h2,
      #notion-article .notion-h2 *,
      #notion-article .notion-h3,
      #notion-article .notion-h3 *,
      #notion-article .notion-quote,
      #notion-article .notion-quote *,
      #notion-article .notion-callout-text,
      #notion-article .notion-callout-text *,
      #notion-article .notion-simple-table td,
      #notion-article .notion-simple-table th,
      #notion-article .notion-table-of-contents-item,
      #notion-article .notion-table-of-contents-item *,
      #notion-article .notion-bookmark-title,
      #notion-article .notion-bookmark-description,
      #notion-article .notion-bookmark-link div,
      #notion-article .notion-page-title-text,
      #notion-article li,
      #notion-article li *,
      #notion-article .notion-link {
        color: black !important;
      }

      .dark #notion-article,
      .dark #notion-article .notion-text,
      .dark #notion-article .notion-text *,
      .dark #notion-article .notion-h1,
      .dark #notion-article .notion-h1 *,
      .dark #notion-article .notion-h2,
      .dark #notion-article .notion-h2 *,
      .dark #notion-article .notion-h3,
      .dark #notion-article .notion-h3 *,
      .dark #notion-article .notion-quote,
      .dark #notion-article .notion-quote *,
      .dark #notion-article .notion-callout-text,
      .dark #notion-article .notion-callout-text *,
      .dark #notion-article .notion-simple-table td,
      .dark #notion-article .notion-simple-table th,
      .dark #notion-article .notion-table-of-contents-item,
      .dark #notion-article .notion-table-of-contents-item *,
      .dark #notion-article .notion-bookmark-title,
      .dark #notion-article .notion-bookmark-description,
      .dark #notion-article .notion-bookmark-link div,
      .dark #notion-article .notion-page-title-text,
      .dark #notion-article li,
      .dark #notion-article li *,
      .dark #notion-article .notion-link {
        color: white !important;
      }

      /* 代码高亮 - 超亮配色 */
      #notion-article pre[class*='language-'] code,
      #notion-article .notion-code code {
        color: #f8fafc !important;
      }
      #notion-article .token.comment,
      #notion-article .token.prolog,
      #notion-article .token.doctype,
      #notion-article .token.cdata {
        color: #a5b4fc !important;
      }
      #notion-article .token.punctuation {
        color: #f9a8d4 !important;
      }
      #notion-article .token.property,
      #notion-article .token.tag,
      #notion-article .token.constant,
      #notion-article .token.symbol,
      #notion-article .token.deleted {
        color: #67e8f9 !important;
      }
      #notion-article .token.boolean,
      #notion-article .token.number {
        color: #fcd34d !important;
      }
      #notion-article .token.selector,
      #notion-article .token.attr-name,
      #notion-article .token.string,
      #notion-article .token.char,
      #notion-article .token.builtin,
      #notion-article .token.inserted {
        color: #86efac !important;
      }
      #notion-article .token.operator,
      #notion-article .token.entity,
      #notion-article .token.url,
      #notion-article .token.variable {
        color: #fda4af !important;
      }
      #notion-article .token.atrule,
      #notion-article .token.attr-value,
      #notion-article .token.keyword {
        color: #c4b5fd !important;
      }
      #notion-article .token.function {
        color: #93c5fd !important;
      }
      #notion-article .token.class-name {
        color: #5eead4 !important;
      }
      #notion-article .token.regex,
      #notion-article .token.important {
        color: #fca5a5 !important;
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

      /* 公告栏卡片中的文字设置为白色 */
      #announcement-content .notion-text {
        color: white !important;
      }
    `}</style>
  )
}

export { Style }
