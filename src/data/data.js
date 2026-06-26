/**
 * 博客基础数据
 * 分类与文章列表由 vite-plugin-articles-scanner 自动扫描生成
 *
 * 新增文章：将 {id}-{title}.html|md 放入 public/articles/{分类}/ 目录
 * 新增分类：在 public/articles/categories.json 添加配置，分类 icon 放入 public/icons/ 目录
 * 文章封面图：放入 public/images/{分类}/ 目录，在 meta.json 的 articles.{id}.image 中填写文件名
 */

import { articles as scannedArticles, categories as scannedCategories } from 'virtual:articles-manifest';

// 分类图标统一存放在 public/icons/ 下
// categories.json 中的 icon 字段填写文件名（如 frontend.svg），运行时解析为 /icons/frontend.svg
const ICON_BASE = '/icons/';

// 将 icon 文件名解析为完整路径
const resolveIcon = (iconField) => {
  if (!iconField) return '';
  if (iconField.startsWith('/') || /^https?:\/\//.test(iconField)) return iconField;
  return ICON_BASE + iconField;
};

// 将文章图片字段解析为完整路径
// 文章封面图存放在 public/images/{categoryId}/ 下，meta.json 中填写文件名即可
const resolveArticleImage = (categoryId, imageField) => {
  if (!imageField) return '';
  if (imageField.startsWith('/') || /^https?:\/\//.test(imageField)) return imageField;
  return `/images/${categoryId}/${imageField}`;
};

// 分类数据：icon 解析为完整路径，供组件直接使用
export const categoriesData = scannedCategories.map(category => ({
  id: category.id,
  name: category.name,
  icon: resolveIcon(category.icon),
  image: category.image ? resolveArticleImage(category.id, category.image) : ''
}));

// 文章数据：合并扫描结果，文章 image 优先使用 meta.json 配置，无配置时返回空字符串由组件 fallback
export const articlesData = Object.fromEntries(
  categoriesData.map(category => {
    const categoryArticles = scannedArticles[category.id] || [];
    const categoryConfig = scannedCategories.find(c => c.id === category.id) || {};
    const fallbackTags = categoryConfig.tags || [];

    const enrichedArticles = categoryArticles.map(article => ({
      ...article,
      image: resolveArticleImage(category.id, article.image),
      tags: article.tags?.length ? article.tags : [...fallbackTags]
    }));

    return [category.id, enrichedArticles];
  })
);
