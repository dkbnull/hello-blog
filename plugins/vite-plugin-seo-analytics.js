export default function vitePluginSeoAnalytics(options = {}) {
    const {
        siteName = '',
        siteUrl = '',
        siteDesc = '',
        keywords = '',
        baId = '',
        ogLocale = 'zh_CN',
        searchAction = ''
    } = options

    return {
        name: 'vite-plugin-seo-analytics',

        transformIndexHtml(html) {
            const headInject = []

            headInject.push(`<meta name="description" content="${siteDesc}"/>`)
            if (keywords) {
                headInject.push(`<meta name="keywords" content="${keywords}"/>`)
            }
            headInject.push(`<meta name="author" content="${siteName}"/>`)
            headInject.push(`<meta name="robots" content="index, follow"/>`)
            headInject.push(`<link rel="canonical" href="${siteUrl}/"/>`)

            headInject.push(`<meta property="og:type" content="website"/>`)
            headInject.push(`<meta property="og:title" content="${siteName} - ${siteDesc}"/>`)
            headInject.push(`<meta property="og:description" content="${siteDesc}"/>`)
            headInject.push(`<meta property="og:url" content="${siteUrl}/"/>`)
            headInject.push(`<meta property="og:site_name" content="${siteName}"/>`)
            headInject.push(`<meta property="og:locale" content="${ogLocale}"/>`)

            headInject.push(`<meta name="twitter:card" content="summary_large_image"/>`)
            headInject.push(`<meta name="twitter:title" content="${siteName} - ${siteDesc}"/>`)
            headInject.push(`<meta name="twitter:description" content="${siteDesc}"/>`)

            const searchActionJson = searchAction
                ? `,"potentialAction":{"@type":"SearchAction","target":"${searchAction}","query-input":"required name=search_term_string"}`
                : ''

            headInject.push(`<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"${siteName}","url":"${siteUrl}","description":"${siteDesc}","inLanguage":"zh-CN","publisher":{"@type":"Organization","name":"${siteName}","url":"${siteUrl}"}${searchActionJson}}</script>`)

            let result = html.replace('</head>', headInject.join('\n    ') + '\n</head>')

            if (baId) {
                const baiduScript = `<script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?${baId}";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();</script>`
                result = result.replace('</body>', baiduScript + '\n</body>')
            }

            return result
        }
    }
}
