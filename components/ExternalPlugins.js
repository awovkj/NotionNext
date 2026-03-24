import { siteConfig } from '@/lib/config'
import { convertInnerUrl } from '@/lib/db/notion/convertInnerUrl'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { GlobalStyle } from './GlobalStyle'
import { initGoogleAdsense } from './GoogleAdsense'

import Head from 'next/head'
import ExternalScript from './ExternalScript'
import WebWhiz from './Webwhiz'
import { useGlobal } from '@/lib/global'
import IconFont from './IconFont'

/**
 * 各种插件脚本
 * @param {*} props
 * @returns
 */
const ExternalPlugin = props => {
  // 读取自Notion的配置
  const { NOTION_CONFIG } = props
  const { lang } = useGlobal()

  // 批量读取所有配置项，避免每次渲染重复调用 siteConfig
  const config = useMemo(() => {
    const nc = NOTION_CONFIG
    return {
      DISABLE_PLUGIN: siteConfig('DISABLE_PLUGIN', null, nc),
      DEBUG: siteConfig('DEBUG', null, nc),
      ANALYTICS_ACKEE_TRACKER: siteConfig('ANALYTICS_ACKEE_TRACKER', null, nc),
      ANALYTICS_VERCEL: siteConfig('ANALYTICS_VERCEL', null, nc),
      ANALYTICS_BUSUANZI_ENABLE: siteConfig('ANALYTICS_BUSUANZI_ENABLE', null, nc),
      ADSENSE_GOOGLE_ID: siteConfig('ADSENSE_GOOGLE_ID', null, nc),
      FACEBOOK_APP_ID: siteConfig('FACEBOOK_APP_ID', null, nc),
      FACEBOOK_PAGE_ID: siteConfig('FACEBOOK_PAGE_ID', null, nc),
      FIREWORKS: siteConfig('FIREWORKS', null, nc),
      SAKURA: siteConfig('SAKURA', null, nc),
      STARRY_SKY: siteConfig('STARRY_SKY', null, nc),
      MUSIC_PLAYER: siteConfig('MUSIC_PLAYER', null, nc),
      NEST: siteConfig('NEST', null, nc),
      FLUTTERINGRIBBON: siteConfig('FLUTTERINGRIBBON', null, nc),
      COMMENT_TWIKOO_COUNT_ENABLE: siteConfig('COMMENT_TWIKOO_COUNT_ENABLE', null, nc),
      RIBBON: siteConfig('RIBBON', null, nc),
      CUSTOM_RIGHT_CLICK_CONTEXT_MENU: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU', null, nc),
      CAN_COPY: siteConfig('CAN_COPY', null, nc),
      WEB_WHIZ_ENABLED: siteConfig('WEB_WHIZ_ENABLED', null, nc),
      AD_WWADS_BLOCK_DETECT: siteConfig('AD_WWADS_BLOCK_DETECT', null, nc),
      CHATBASE_ID: siteConfig('CHATBASE_ID', null, nc),
      COMMENT_DAO_VOICE_ID: siteConfig('COMMENT_DAO_VOICE_ID', null, nc),
      AD_WWADS_ID: siteConfig('AD_WWADS_ID', null, nc),
      COMMENT_ARTALK_SERVER: siteConfig('COMMENT_ARTALK_SERVER', null, nc),
      COMMENT_ARTALK_JS: siteConfig('COMMENT_ARTALK_JS', null, nc),
      COMMENT_TIDIO_ID: siteConfig('COMMENT_TIDIO_ID', null, nc),
      COMMENT_GITTER_ROOM: siteConfig('COMMENT_GITTER_ROOM', null, nc),
      ANALYTICS_BAIDU_ID: siteConfig('ANALYTICS_BAIDU_ID', null, nc),
      ANALYTICS_CNZZ_ID: siteConfig('ANALYTICS_CNZZ_ID', null, nc),
      ANALYTICS_GOOGLE_ID: siteConfig('ANALYTICS_GOOGLE_ID', null, nc),
      MATOMO_HOST_URL: siteConfig('MATOMO_HOST_URL', null, nc),
      MATOMO_SITE_ID: siteConfig('MATOMO_SITE_ID', null, nc),
      ANALYTICS_51LA_ID: siteConfig('ANALYTICS_51LA_ID', null, nc),
      ANALYTICS_51LA_CK: siteConfig('ANALYTICS_51LA_CK', null, nc),
      DIFY_CHATBOT_ENABLED: siteConfig('DIFY_CHATBOT_ENABLED', null, nc),
      TIANLI_KEY: siteConfig('TianliGPT_KEY', null, nc),
      GLOBAL_JS: siteConfig('GLOBAL_JS', '', nc),
      CLARITY_ID: siteConfig('CLARITY_ID', null, nc),
      IMG_SHADOW: siteConfig('IMG_SHADOW', null, nc),
      ANIMATE_CSS_URL: siteConfig('ANIMATE_CSS_URL', null, nc),
      MOUSE_FOLLOW: siteConfig('MOUSE_FOLLOW', null, nc),
      CUSTOM_EXTERNAL_CSS: siteConfig('CUSTOM_EXTERNAL_CSS', null, nc),
      CUSTOM_EXTERNAL_JS: siteConfig('CUSTOM_EXTERNAL_JS', null, nc),
      ENABLE_NPROGRSS: siteConfig('ENABLE_NPROGRSS', false),
      COZE_BOT_ID: siteConfig('COZE_BOT_ID'),
      HILLTOP_ADS_META_ID: siteConfig('HILLTOP_ADS_META_ID', null, nc),
      ENABLE_ICON_FONT: siteConfig('ENABLE_ICON_FONT', false),
      UMAMI_HOST: siteConfig('UMAMI_HOST', null, nc),
      UMAMI_ID: siteConfig('UMAMI_ID', null, nc)
    }
  }, [NOTION_CONFIG])

  useEffect(() => {
    if (!isBrowser) {
      return
    }
    loadExternalResource('/css/custom.css', 'css')
    loadExternalResource('/js/custom.js', 'js')
  }, [])

  useEffect(() => {
    if (!isBrowser) {
      return
    }
    if (config.IMG_SHADOW) {
      loadExternalResource('/css/img-shadow.css', 'css')
    }
    if (config.ANIMATE_CSS_URL) {
      loadExternalResource(config.ANIMATE_CSS_URL, 'css')
    }
    if (config.CUSTOM_EXTERNAL_JS && config.CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of config.CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js')
      }
    }
    if (config.CUSTOM_EXTERNAL_CSS && config.CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of config.CUSTOM_EXTERNAL_CSS) {
        loadExternalResource(url, 'css')
      }
    }
  }, [config.ANIMATE_CSS_URL, config.CUSTOM_EXTERNAL_CSS, config.CUSTOM_EXTERNAL_JS, config.IMG_SHADOW])

  const router = useRouter()
  useEffect(() => {
    // 异步渲染谷歌广告
    if (config.ADSENSE_GOOGLE_ID) {
      setTimeout(() => {
        initGoogleAdsense(config.ADSENSE_GOOGLE_ID)
      }, 3000)
    }

    setTimeout(() => {
      // 映射url
      convertInnerUrl({ allPages: props?.allNavPages, lang: lang })
    }, 500)
  }, [config.ADSENSE_GOOGLE_ID, lang, props?.allNavPages, router.asPath])

  useEffect(() => {
    // 执行注入脚本
    // eslint-disable-next-line no-eval
    if (config.GLOBAL_JS && config.GLOBAL_JS.trim() !== '') {
      eval(config.GLOBAL_JS)
    }
  }, [config.GLOBAL_JS])

  if (config.DISABLE_PLUGIN) {
    return null
  }

  return (
    <>
      {/* 全局样式嵌入 */}
      <GlobalStyle />
      {config.ENABLE_ICON_FONT && <IconFont />}
      {config.MOUSE_FOLLOW && <MouseFollow />}
      {config.DEBUG && <DebugPanel />}
      {config.ANALYTICS_ACKEE_TRACKER && <Ackee />}
      {config.ANALYTICS_GOOGLE_ID && <Gtag />}
      {config.ANALYTICS_VERCEL && <Analytics />}
      {config.ANALYTICS_BUSUANZI_ENABLE && <Busuanzi />}
      {config.FACEBOOK_APP_ID && config.FACEBOOK_PAGE_ID && <Messenger />}
      {config.FIREWORKS && <Fireworks />}
      {config.SAKURA && <Sakura />}
      {config.STARRY_SKY && <StarrySky />}
      {config.MUSIC_PLAYER && <MusicPlayer />}
      {config.NEST && <Nest />}
      {config.FLUTTERINGRIBBON && <FlutteringRibbon />}
      {config.COMMENT_TWIKOO_COUNT_ENABLE && <TwikooCommentCounter {...props} />}
      {config.RIBBON && <Ribbon />}
      {config.DIFY_CHATBOT_ENABLED && <DifyChatbot />}
      {config.CUSTOM_RIGHT_CLICK_CONTEXT_MENU && <CustomContextMenu {...props} />}
      {!config.CAN_COPY && <DisableCopy />}
      {config.WEB_WHIZ_ENABLED && <WebWhiz />}
      {config.AD_WWADS_BLOCK_DETECT && <AdBlockDetect />}
      {config.TIANLI_KEY && <TianliGPT />}
      <VConsole />
      {config.ENABLE_NPROGRSS && <LoadingProgress />}
      <AosAnimation />
      {config.ANALYTICS_51LA_ID && config.ANALYTICS_51LA_CK && <LA51 />}
      {config.COZE_BOT_ID && <Coze />}

      {config.ANALYTICS_51LA_ID && config.ANALYTICS_51LA_CK && (
        <>
          <script id='LA_COLLECT' src='//sdk.51.la/js-sdk-pro.min.js' defer />
          {/* <script async dangerouslySetInnerHTML={{
              __html: `
                    LA.init({id:"${config.ANALYTICS_51LA_ID}",ck:"${config.ANALYTICS_51LA_CK}",hashMode:true,autoTrack:true})
                    `
            }} /> */}
        </>
      )}

      {config.CHATBASE_ID && (
        <>
          <script
            id={config.CHATBASE_ID}
            src='https://www.chatbase.co/embed.min.js'
            defer
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                    window.chatbaseConfig = {
                        chatbotId: "${config.CHATBASE_ID}",
                        }
                    `
            }}
          />
        </>
      )}

      {config.CLARITY_ID && (
        <>
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                (function(c, l, a, r, i, t, y) {
                  c[a] = c[a] || function() {
                    (c[a].q = c[a].q || []).push(arguments);
                  };
                  t = l.createElement(r);
                  t.async = 1;
                  t.src = "https://www.clarity.ms/tag/" + i;
                  y = l.getElementsByTagName(r)[0];
                  if (y && y.parentNode) {
                    y.parentNode.insertBefore(t, y);
                  } else {
                    l.head.appendChild(t);
                  }
                })(window, document, "clarity", "script", "${config.CLARITY_ID}");
                `
            }}
          />
        </>
      )}

      {config.COMMENT_DAO_VOICE_ID && (
        <>
          {/* DaoVoice 反馈 */}
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                (function(i, s, o, g, r, a, m) {
                  i["DaoVoiceObject"] = r;
                  i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments);
                  };
                  i[r].l = 1 * new Date();
                  a = s.createElement(o);
                  m = s.getElementsByTagName(o)[0];
                  a.async = 1;
                  a.src = g;
                  a.charset = "utf-8";
                  if (m && m.parentNode) {
                    m.parentNode.insertBefore(a, m);
                  } else {
                    s.head.appendChild(a);
                  }
                })(window, document, "script", ('https:' == document.location.protocol ? 'https:' : 'http:') + "//widget.daovoice.io/widget/daf1a94b.js", "daovoice")
                `
            }}
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
             daovoice('init', {
                app_id: "${config.COMMENT_DAO_VOICE_ID}"
              });
              daovoice('update');
              `
            }}
          />
        </>
      )}

      {/* HILLTOP广告验证 */}
      {config.HILLTOP_ADS_META_ID && (
        <Head>
          <meta name={config.HILLTOP_ADS_META_ID} content={config.HILLTOP_ADS_META_ID} />
        </Head>
      )}

      {config.AD_WWADS_ID && (
        <>
          <Head>
            {/* 提前连接到广告服务器 */}
            <link rel='preconnect' href='https://cdn.wwads.cn' />
          </Head>
          <ExternalScript
            type='text/javascript'
            src='https://cdn.wwads.cn/js/makemoney.js'
          />
        </>
      )}

      {/* {COMMENT_TWIKOO_ENV_ID && <script defer src={COMMENT_TWIKOO_CDN_URL} />} */}

      {config.COMMENT_ARTALK_SERVER && <script defer src={config.COMMENT_ARTALK_JS} />}

      {config.COMMENT_TIDIO_ID && (
        <script async src={`//code.tidio.co/${config.COMMENT_TIDIO_ID}.js`} />
      )}

      {/* gitter聊天室 */}
      {config.COMMENT_GITTER_ROOM && (
        <>
          <script
            src='https://sidecar.gitter.im/dist/sidecar.v1.js'
            async
            defer
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
            ((window.gitter = {}).chat = {}).options = {
              room: '${config.COMMENT_GITTER_ROOM}'
            };
            `
            }}
          />
        </>
      )}

      {/* 百度统计 */}
      {config.ANALYTICS_BAIDU_ID && (
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${config.ANALYTICS_BAIDU_ID}";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();
          `
          }}
        />
      )}

      {/* 站长统计 */}
      {config.ANALYTICS_CNZZ_ID && (
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
          document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${config.ANALYTICS_CNZZ_ID}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${config.ANALYTICS_CNZZ_ID}' type='text/javascript'%3E%3C/script%3E"));
          `
          }}
        />
      )}

      {/* UMAMI 统计 */}
      {config.UMAMI_ID && (
        <script
          async
          defer
          src={config.UMAMI_HOST}
          data-website-id={config.UMAMI_ID}
        ></script>
      )}

      {/* 谷歌统计 */}
      {config.ANALYTICS_GOOGLE_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ANALYTICS_GOOGLE_ID}`}
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.ANALYTICS_GOOGLE_ID}', {
                  page_path: window.location.pathname,
                });
              `
            }}
          />
        </>
      )}

      {/* Matomo 统计 */}
      {config.MATOMO_HOST_URL && config.MATOMO_SITE_ID && (
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//${config.MATOMO_HOST_URL}/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${config.MATOMO_SITE_ID}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `
          }}
        />
      )}
    </>
  )
}

const TwikooCommentCounter = dynamic(
  () => import('@/components/TwikooCommentCounter'),
  { ssr: false }
)
const DebugPanel = dynamic(() => import('@/components/DebugPanel'), {
  ssr: false
})
const Fireworks = dynamic(() => import('@/components/Fireworks'), {
  ssr: false
})
const MouseFollow = dynamic(() => import('@/components/MouseFollow'), {
  ssr: false
})
const Nest = dynamic(() => import('@/components/Nest'), { ssr: false })
const FlutteringRibbon = dynamic(
  () => import('@/components/FlutteringRibbon'),
  { ssr: false }
)
const Ribbon = dynamic(() => import('@/components/Ribbon'), { ssr: false })
const Sakura = dynamic(() => import('@/components/Sakura'), { ssr: false })
const StarrySky = dynamic(() => import('@/components/StarrySky'), {
  ssr: false
})
const DifyChatbot = dynamic(() => import('@/components/DifyChatbot'), {
  ssr: false
})
const Analytics = dynamic(
  () =>
    import('@vercel/analytics/react').then(m => {
      return m.Analytics
    }),
  { ssr: false }
)
const MusicPlayer = dynamic(() => import('@/components/Player'), { ssr: false })
const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false })
const Messenger = dynamic(() => import('@/components/FacebookMessenger'), {
  ssr: false
})
const VConsole = dynamic(() => import('@/components/VConsole'), { ssr: false })
const CustomContextMenu = dynamic(
  () => import('@/components/CustomContextMenu'),
  { ssr: false }
)
const DisableCopy = dynamic(() => import('@/components/DisableCopy'), {
  ssr: false
})
const AdBlockDetect = dynamic(() => import('@/components/AdBlockDetect'), {
  ssr: false
})
const LoadingProgress = dynamic(() => import('@/components/LoadingProgress'), {
  ssr: false
})
const AosAnimation = dynamic(() => import('@/components/AOSAnimation'), {
  ssr: false
})

const Coze = dynamic(() => import('@/components/Coze'), {
  ssr: false
})
const LA51 = dynamic(() => import('@/components/LA51'), {
  ssr: false
})
const TianliGPT = dynamic(() => import('@/components/TianliGPT'), {
  ssr: false
})

export default ExternalPlugin
