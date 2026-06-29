<h1 align="center">
  <img src="public/favicon.svg" alt="Hello Blog" width="80" height="80">
  <br>
  Hello Blog
</h1>

<p align="center">
  <a href="https://github.com/dkbnull/hello-blog" target="_blank">
     <img src="https://img.shields.io/badge/GitHub-访问地址-blue?logo=github">
  </a>
  <a href="https://gitee.com/dkbnull/hello-blog" target="_blank">
     <img src="https://img.shields.io/badge/Gitee-访问地址-red?logo=gitee">
  </a>
  <img src="https://img.shields.io/badge/Vue-3.5.30-42b883?logo=vue.js">
  <img src="https://img.shields.io/badge/Vite-8.0.8-646cff?logo=vite">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue">
</p>

---

## 项目简介

Hello Blog 是一个基于 Vue 3 + Vite 构建的个人博客系统，用于分享技术文章、开发笔记与生活感悟。

## 功能特性

### 📝 文章管理

- 文章分类浏览
- 文章标签筛选
- 支持 HTML 和 Markdown 两种格式文章展示
- 文章内容缓存，避免重复请求
- 文章与分类运行时动态加载，新增文章无需编译（fetch `categories.json` + 各分类 `meta.json`）

### 🔍 搜索功能

- 全站模糊搜索，支持按标题、分类、标签匹配
- 独立搜索结果页面

### 🎨 界面设计

- 响应式布局，适配桌面端/移动端
- 深色/浅色模式切换（状态持久化至 localStorage）
- CSS 变量统一主题配色（主题色 #42b883）
- 卡片式设计，简洁美观
- 默认布局组件（Header + Main + Footer + BackToTop）

### ⚡ 性能优化

- 路由懒加载
- 构建资源自动哈希
- Vite 手动分包（vue/markdown 独立 chunk）
- API 与组件自动导入（unplugin-auto-import / unplugin-vue-components）

### 🔎 SEO 优化

- 构建时注入 SEO 元标签（description、keywords、OG、Twitter Card）
- 构建时注入 JSON-LD 结构化数据（WebSite + SearchAction）
- 运行时路由级 SEO 元信息自动更新
- 文章详情页动态 SEO
- Canonical URL 设置

### 📊 数据统计

- 百度统计集成
- 页面浏览自动上报
- 自定义事件上报支持

### 📄 分页与排序

- 文章列表分页（每页 10 篇）
- 按日期升序/降序排序

## 技术栈

| 技术                       | 版本     | 说明          |
|--------------------------|--------|-------------|
| Vue                      | 3.5.30 | 前端框架        |
| Vue Router               | 5.0.3  | 路由管理        |
| Pinia                    | 3.0.4  | 状态管理        |
| Vite                     | 8.0.8  | 构建工具        |
| marked                   | 17.0.4 | Markdown 解析 |
| unplugin-auto-import     | 21.0.0 | API 自动导入    |
| unplugin-vue-components  | 32.0.0 | 组件自动导入      |
| vite-plugin-vue-devtools | 8.1.1  | Vue 开发者工具   |

## 项目结构

```
hello-blog/
├── plugins/                        # Vite 插件
│   └── vite-plugin-seo-analytics.js    # SEO 分析构建插件
├── public/
│   ├── articles/                   # 文章目录（运行时 fetch 加载）
│   │   ├── categories.json         # 分类配置（id、name、icon、tags、image）
│   │   ├── {category}/             # 分类目录，内放 {id}-{title}.html 文章
│   │   │   └── meta.json           # 文章元数据清单（title/ext/date/tags/image 等）
│   │   ├── frontend/
│   │   └── backend/
│   ├── icons/                      # 分类图标（categories.json 的 icon 字段引用）
│   ├── images/                     # 文章封面图（按分类子目录组织）
│   │   ├── frontend/
│   │   └── backend/
│   └── favicon.svg                 # Logo
├── src/
│   ├── assets/                     # 资源文件（default.svg 兜底图等）
│   ├── components/                 # 组件
│   │   ├── BackToTop.vue           # 回到顶部
│   │   ├── Footer.vue              # 底部
│   │   ├── Header.vue              # 顶部导航
│   │   ├── Pagination.vue          # 分页
│   │   ├── PostCard.vue            # 文章卡片
│   │   ├── Sidebar.vue             # 侧边栏
│   │   └── SortControl.vue         # 排序控制
│   ├── composables/                # 组合式函数
│   │   ├── usePagination.js        # 分页逻辑
│   │   └── useSeo.js               # SEO 元信息管理
│   ├── data/                       # 数据层
│   │   ├── articles.js             # 文章查询/搜索/内容加载
│   │   └── data.js                 # 运行时加载分类与文章元数据（fetch + ref）
│   ├── layouts/
│   │   └── DefaultLayout.vue       # 默认布局
│   ├── plugins/
│   │   └── seoAnalytics.js         # SEO 分析运行时插件
│   ├── router/
│   │   └── index.js                # 路由配置
│   ├── stores/
│   │   └── app.js                  # 全局状态（深色模式等）
│   ├── views/                      # 页面
│   │   ├── About.vue               # 关于
│   │   ├── ArticleDetail.vue       # 文章详情
│   │   ├── Home.vue                # 首页/分类页
│   │   ├── NotFound.vue            # 404
│   │   └── Search.vue              # 搜索
│   ├── App.vue                     # 根组件（启动时触发数据加载）
│   ├── main.js                     # 入口文件
│   └── style.css                   # 全局样式（含 CSS 变量）
├── .env                            # 环境变量
├── index.html                      # HTML 入口
├── vite.config.js                  # Vite 配置
└── package.json
```

## 如何添加文章

文章与分类在**运行时**通过 fetch `categories.json` + 各分类 `meta.json` 动态加载，新增文章无需编译，刷新页面即可生效。

### 1. 新增文章

1. 将文章文件放入对应分类目录，命名格式为 `{id}-{title}.html` 或 `{id}-{title}.md`：

   ```
   public/articles/
   ├── frontend/
   │   ├── 01-Vue 3 新特性详解.html
   │   └── 02-TypeScript 入门指南.html
   ├── backend/
   │   ├── 01-Node.js 性能优化技巧.html
   │   └── ...
   └── ...
   ```

   - `id`：文章在分类下的唯一标识（如 01、02），按倒序排列展示
   - `title`：文章标题，需与文件名中 `-` 后的部分一致

2. 在该分类的 `meta.json` 中添加一条文章记录：

   ```json
   {
     "articles": {
       "02": {
         "title": "TypeScript 入门指南",
         "ext": "html",
         "date": "2026-06-28",
         "author": "null",
         "tags": ["TypeScript", "前端"],
         "image": "typescript.svg"
       }
     }
   }
   ```

   | 字段     | 类型     | 必填 | 说明                                       |
   |----------|----------|------|--------------------------------------------|
   | `title`  | string   | 是   | 文章标题，需与文件名一致                   |
   | `ext`    | string   | 是   | 文件扩展名（`html` 或 `md`）               |
   | `date`   | string   | 是   | 发布日期（YYYY-MM-DD）                     |
   | `author` | string   | 否   | 作者，默认 `null`                          |
   | `tags`   | string[] | 否   | 标签数组，未配置时继承分类默认 tags        |
   | `image`  | string   | 是   | 封面图文件名，放在 `public/images/{分类}/` |

3. 将封面图放入 `public/images/{分类}/` 目录：

   ```
   public/images/
   ├── frontend/
   │   ├── vue3.svg
   │   └── typescript.svg
   └── backend/
       └── nodejs.svg
   ```

   `meta.json` 中填写文件名即可，运行时自动解析为 `/images/{分类}/{文件名}`。

### 2. 新增分类

1. 在 `public/articles/` 下创建分类目录（目录名即分类 id），并添加 `meta.json`：

   ```json
   {
     "articles": {}
   }
   ```

2. 在 `public/articles/categories.json` 添加分类配置：

   ```json
   {
     "categories": [
       {
         "id": "frontend",
         "name": "前端开发",
         "icon": "frontend.svg",
         "image": "frontend.png",
         "tags": ["前端"]
       }
     ]
   }
   ```

   - `icon`：分类图标，放在 `public/icons/` 目录，填写文件名
   - `image`：分类默认封面图，放在 `public/images/{分类}/` 目录，填写文件名
   - `tags`：分类默认标签，文章未配置 tags 时继承

3. `icon` 字段支持三种写法：文件名（`frontend.svg` → 解析为 `/icons/frontend.svg`）、`/` 开头的 public 路径、完整 URL。

### 3. 数据加载机制

- 应用启动时（`App.vue` 的 `onMounted`）调用 `loadArticlesData()`
- 并发 fetch `categories.json` + 所有分类的 `meta.json`
- 数据存入 `ref`，组件通过 `computed` 自动响应更新
- 加载过程中 Sidebar 和 Home 显示 loading 动画
- 文章内容（HTML/MD 文件）在访问详情页时按需 fetch，并缓存避免重复请求

## 许可证

Apache License 2.0

---

<p align="center">
  <a href="https://github.com/dkbnull">
    <img src="https://img.shields.io/badge/Author-null-42b883?style=flat-square">
  </a>
</p>
