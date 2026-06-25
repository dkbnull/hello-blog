/**
 * 博客基础数据
 * 分类与文章列表由 vite-plugin-articles-scanner 自动扫描生成
 *
 * 新增文章：将 {id}_{title}.html|md 放入 public/articles/{分类}/ 目录
 * 新增分类：在 public/articles/categories.json 添加配置，图标放入 public/icons/ 目录
 */

import { articles as scannedArticles, categories as scannedCategories } from 'virtual:articles-manifest';
import defaultImage from '@/assets/default.svg';

// 分类图标统一存放在 public/icons/ 下
// categories.json 中的 image 字段填写文件名（如 java.png），运行时解析为 /icons/java.png
const ICON_BASE = '/icons/';

const resolveCategoryImage = (imageField) => {
  if (!imageField) return defaultImage;
  // 若已是绝对路径或 / 开头的 public 路径，直接使用
  if (imageField.startsWith('/') || /^https?:\/\//.test(imageField)) {
    return imageField;
  }
  return ICON_BASE + imageField;
};

// 分类数据：合并扫描结果与图片资源
export const categoriesData = scannedCategories.map(category => ({
  id: category.id,
  name: category.name,
  icon: category.icon,
  image: resolveCategoryImage(category.image)
}));

// 文章数据：合并扫描结果与分类级别的图片、tags
export const articlesData = Object.fromEntries(
  categoriesData.map(category => {
    const categoryArticles = scannedArticles[category.id] || [];
    const categoryConfig = scannedCategories.find(c => c.id === category.id) || {};
    const fallbackTags = categoryConfig.tags || [];

    const enrichedArticles = categoryArticles.map(article => ({
      ...article,
      image: resolveCategoryImage(categoryConfig.image),
      tags: article.tags?.length ? article.tags : [...fallbackTags]
    }));

    return [category.id, enrichedArticles];
  })
);
