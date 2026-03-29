// 文章服务，用于读取和处理文章数据

// 导入数据
import {articlesData, categoriesData} from "./data.js";

// 获取所有分类
export const getCategories = () => {
    return categoriesData;
};

// 获取分类名称
export const getCategoryName = (categoryId) => {
    const category = categoriesData.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
};

// 获取分类文章数量
export const getArticleCount = (categoryId) => {
    const articles = articlesData[categoryId] || [];
    return articles.length;
};

// 获取分类下的文章
export const getArticlesByCategory = (categoryId) => {
    return articlesData[categoryId] || [];
};

// 获取所有文章
export const getAllArticles = () => {
    let allArticles = [];

    Object.values(articlesData).forEach(articles => {
        allArticles = [...allArticles, ...articles];
    });

    return allArticles;
};

// 获取文章详情
export const getArticleById = (categoryId, articleId) => {
    const articles = articlesData[categoryId] || [];
    return articles.find(article => article.id === articleId);
};

// 缓存文章内容
const articleContentCache = new Map();

// 构建文章文件路径
const buildArticlePath = (categoryId, articleId, title, extension) => {
    const fileName = `${articleId}_${title}.${extension}`;

    if (import.meta.env.VITE_IMAGE_BASE_URL) {
        return `${import.meta.env.VITE_IMAGE_BASE_URL}/articles/${categoryId}/${fileName}`;
    }

    // 本地开发，使用相对路径
    return new URL(`./articles/${categoryId}/${fileName}`, import.meta.url).href;
};

// 构建图片基础路径
const buildImageBaseUrl = (categoryId) => {
    return import.meta.env.VITE_IMAGE_BASE_URL
        ? `${import.meta.env.VITE_IMAGE_BASE_URL}/articles/${categoryId}/assets/`
        : `/src/data/articles/${categoryId}/assets/`;
};

// 生成错误内容
const generateErrorContent = (title, message) => `
    <div class="article-content">
        <h1>${title || '文章不存在'}</h1>
        <p>${message}</p>
    </div>
`;

// 读取文章内容
export const getArticleContent = async (categoryId, articleId) => {
    // 检查缓存
    const cacheKey = `${categoryId}-${articleId}`;
    if (articleContentCache.has(cacheKey)) {
        return articleContentCache.get(cacheKey);
    }

    try {
        // 获取文章信息
        const article = getArticleById(categoryId, articleId);
        if (!article) {
            const errorContent = generateErrorContent(null, '找不到指定的文章，请检查链接是否正确。');
            articleContentCache.set(cacheKey, errorContent);
            return errorContent;
        }

        // 尝试加载 HTML 文件
        const htmlPath = buildArticlePath(categoryId, articleId, article.title, 'html');
        const htmlResponse = await fetch(htmlPath);
        if (htmlResponse.ok) {
            let content = await htmlResponse.text();
            // 处理图片路径，将相对路径转换为绝对路径
            const imageBaseUrl = buildImageBaseUrl(categoryId);
            content = content.replace(/src='\.\/assets\//g, `src='${imageBaseUrl}`);
            articleContentCache.set(cacheKey, content);
            return content;
        }

        // 如果 HTML 文件不存在，尝试加载 Markdown 文件
        const mdPath = buildArticlePath(categoryId, articleId, article.title, 'md');
        const mdResponse = await fetch(mdPath);
        if (mdResponse.ok) {
            const mdContent = await mdResponse.text();
            // 使用 marked 库将 Markdown 转换为 HTML
            const {marked} = await import('marked');
            const htmlContent = marked(mdContent);
            articleContentCache.set(cacheKey, htmlContent);
            return htmlContent;
        }

        // 如果都不存在，返回默认内容
        const defaultContent = generateErrorContent(article.title, '文章内容加载失败，请检查文件是否存在。');
        articleContentCache.set(cacheKey, defaultContent);
        return defaultContent;
    } catch (error) {
        console.error('加载文章内容失败:', error);
        const article = getArticleById(categoryId, articleId);
        const errorContent = generateErrorContent(article?.title, `文章内容加载失败: ${error.message}`);
        articleContentCache.set(cacheKey, errorContent);
        return errorContent;
    }
};