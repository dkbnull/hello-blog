import {watch, onUnmounted} from 'vue'
import {useRoute} from 'vue-router'

let _active = false
let _siteUrl = 'https://blog.wbnull.cn'

export function _setActive(value) {
    _active = value
}

export function _setSiteUrl(url) {
    _siteUrl = url
}

const DEFAULT_TITLE = 'Hello Blog - 个人技术博客'
const DEFAULT_DESCRIPTION = 'Hello Blog - 个人技术博客，分享Java、Spring Boot、Docker等技术文章'
const DEFAULT_KEYWORDS = '技术博客,Java,Spring Boot,Docker,Vue,Android,Redis,Linux'

const WEBSITE_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Hello Blog',
    'url': _siteUrl,
    'description': DEFAULT_DESCRIPTION,
    'inLanguage': 'zh-CN',
    'publisher': {
        '@type': 'Organization',
        'name': 'Hello Blog',
        'url': _siteUrl
    },
    'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://blog.wbnull.cn/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
    }
}

function getOrCreateMeta(name, isProperty) {
    const attr = isProperty ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
    }
    return el
}

function removeMeta(name, isProperty) {
    const attr = isProperty ? 'property' : 'name'
    const el = document.querySelector(`meta[${attr}="${name}"]`)
    if (el) el.remove()
}

function setTitle(title) {
    document.title = title || DEFAULT_TITLE
}

function setMeta(name, content, isProperty = false) {
    const el = getOrCreateMeta(name, isProperty)
    el.setAttribute('content', content)
}

function setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]')
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
    }
    el.setAttribute('href', url)
}

function setJsonLd(data) {
    let el = document.getElementById('json-ld-seo')
    if (!el) {
        el = document.createElement('script')
        el.setAttribute('type', 'application/ld+json')
        el.id = 'json-ld-seo'
        document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data)
}

function resetJsonLd() {
    setJsonLd(WEBSITE_JSON_LD)
}

export function updateSeo(meta = {}) {
    const {
        title = DEFAULT_TITLE,
        description = DEFAULT_DESCRIPTION,
        keywords = DEFAULT_KEYWORDS,
        url = _siteUrl,
        ogType = 'website',
        ogImage = ''
    } = meta

    setTitle(title)
    setMeta('description', description)
    setMeta('keywords', keywords)

    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', ogType, true)
    setMeta('og:url', url, true)
    setMeta('og:site_name', 'Hello Blog', true)
    setMeta('og:locale', 'zh_CN', true)
    if (ogImage) {
        setMeta('og:image', ogImage, true)
    }

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    setCanonical(url)
}

function setArticleMeta(article) {
    const tags = article.tags || []
    const title = `${article.title} | Hello Blog`
    const description = article.summary || `${article.title} - ${tags.join('、')} | Hello Blog`
    const url = `${_siteUrl}/article/${article.category}/${article.id}`

    setTitle(title)
    setMeta('description', description)
    setMeta('keywords', tags.join(',') || DEFAULT_KEYWORDS)

    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', url, true)
    setMeta('og:site_name', 'Hello Blog', true)
    setMeta('og:locale', 'zh_CN', true)
    if (article.image) {
        setMeta('og:image', article.image, true)
    }

    setMeta('article:published_time', article.date || '', true)
    setMeta('article:section', article.category || '', true)
    tags.forEach(tag => {
        setMeta('article:tag', tag, true)
    })

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    setCanonical(url)

    setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title || '',
        'datePublished': article.date || '',
        'author': {
            '@type': 'Person',
            'name': article.author || 'Hello Blog'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Hello Blog',
            'logo': {
                '@type': 'ImageObject',
                'url': `${_siteUrl}/favicon.svg`
            }
        },
        'image': article.image || '',
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': url
        },
        'keywords': tags.join(',')
    })
}

function clearArticleMeta() {
    removeMeta('article:published_time', true)
    removeMeta('article:section', true)
    document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove())
    resetJsonLd()
}

export function useSeo(routeMeta) {
    if (!_active) return {
        updateSeo: () => {
        }
    }

    const route = useRoute()

    if (routeMeta) {
        watch(
            () => route.path,
            () => {
                const meta = typeof routeMeta === 'function' ? routeMeta(route) : routeMeta
                updateSeo(meta)
            },
            {immediate: true}
        )
    }

    return {updateSeo}
}

export function useArticleSeo(articleGetter) {
    if (!_active) return

    const route = useRoute()

    const stopWatch = watch(
        [() => route.params.category, () => route.params.id, articleGetter],
        ([, , article]) => {
            if (article) {
                setArticleMeta(article)
            }
        },
        {immediate: true}
    )

    onUnmounted(() => {
        stopWatch()
        clearArticleMeta()
    })
}

export {_siteUrl as SITE_URL}
