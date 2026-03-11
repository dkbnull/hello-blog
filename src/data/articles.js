// 文章服务，用于读取和处理文章数据

// 获取所有分类
import {articlesData, categoriesData} from "./data.js";

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

// 读取文章内容
export const getArticleContent = async (categoryId, articleId) => {
    try {
        // 尝试加载 HTML 文件
        // 由于浏览器不支持通配符，我们需要根据文章标题构建具体的文件名
        const article = getArticleById(categoryId, articleId);
        const htmlFileName = `${articleId}_${article.title}.html`;
        const htmlResponse = await fetch(`/src/data/articles/${categoryId}/${htmlFileName}`);
        if (htmlResponse.ok) {
            // 直接返回完整的 HTML 内容
            return await htmlResponse.text();
        }

        // 如果 HTML 文件不存在，尝试加载 Markdown 文件
        // 由于浏览器不支持通配符，我们需要根据文章标题构建具体的文件名
        if (article) {
            const mdFileName = `${articleId}_${article.title}.md`;
            const mdResponse = await fetch(`/src/data/articles/${categoryId}/${mdFileName}`);
            if (mdResponse.ok) {
                const mdContent = await mdResponse.text();
                // 使用 marked 库将 Markdown 转换为 HTML
                const {marked} = await import('marked');
                return marked(mdContent);
            }
        }

        // 如果都不存在，返回默认内容
        return `
      <div class="article-content">
        <h1>${getArticleById(categoryId, articleId)?.title}</h1>
        <p>文章内容加载失败，请检查文件是否存在。</p>
      </div>
    `;
    } catch (error) {
        console.error('加载文章内容失败:', error);
        return `
      <div class="article-content">
        <h1>${getArticleById(categoryId, articleId)?.title}</h1>
        <p>文章内容加载失败: ${error.message}</p>
      </div>
    `;
    }
};