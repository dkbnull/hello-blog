import {updateSeo, _setActive, _setSiteUrl} from '../composables/useSeo'

function reportPageView(url) {
    if (!window._hmt) return
    window._hmt.push(['_trackPageview', url])
}

function reportEvent(category, action, label, value) {
    if (!window._hmt) return
    window._hmt.push(['_trackEvent', category, action, label, value])
}

export default {
    install(app, {router, siteUrl = ''} = {}) {
        if (!router) return

        _setActive(true)
        if (siteUrl) _setSiteUrl(siteUrl)

        router.afterEach((to) => {
            const meta = to.meta || {}

            if (meta.seo === 'article') {
                reportPageView(to.fullPath)
                return
            }

            if (typeof meta.seo === 'function') {
                const seoData = meta.seo(to)
                updateSeo({
                    title: seoData.title,
                    description: seoData.description,
                    keywords: seoData.keywords,
                    url: siteUrl + to.fullPath
                })
            } else {
                updateSeo({
                    title: meta.title,
                    description: meta.description,
                    keywords: meta.keywords,
                    url: siteUrl + to.fullPath
                })
            }

            reportPageView(to.fullPath)
        })

        app.config.globalProperties.$track = reportEvent

        app.directive('track', {
            beforeMount(el, binding) {
                const {category = 'click', action = 'click', label = '', value} = binding.value || {}
                el._trackHandler = () => reportEvent(category, action, label, value)
                el.addEventListener('click', el._trackHandler)
            },
            unmounted(el) {
                if (el._trackHandler) {
                    el.removeEventListener('click', el._trackHandler)
                    delete el._trackHandler
                }
            }
        })
    }
}
