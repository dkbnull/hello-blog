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

Hello Blog 是一个基于 Vue 3 + Vite 构建的个人技术博客系统，专注于分享 Java、Spring Boot、Docker、Linux 等技术文章。

## 技术栈

| 技术         | 版本     | 说明          |
|------------|--------|-------------|
| Vue        | 3.5.30 | 前端框架        |
| Vue Router | 5.0.3  | 路由管理        |
| Vite       | 8.0.8  | 构建工具        |
| marked     | 17.0.4 | Markdown 解析 |

## 项目结构

```
hello-blog/
├── public/              # 静态资源
│   └── favicon.svg      # Logo
├── src/
│   ├── assets/          # 资源文件（图标、图片）
│   ├── components/      # 组件
│   │   ├── Header.vue   # 顶部导航
│   │   ├── Footer.vue   # 底部
│   │   ├── PostCard.vue # 文章卡片
│   │   └── Sidebar.vue  # 侧边栏
│   ├── data/            # 数据层
│   │   ├── articles.js  # 文章加载工具
│   │   └── data.js      # 文章数据
│   ├── router/          # 路由配置
│   ├── utils/           # 工具函数
│   ├── views/           # 页面
│   │   ├── Home.vue     # 首页/分类页
│   │   ├── ArticleDetail.vue # 文章详情
│   │   └── About.vue    # 关于
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式（含 CSS 变量）
├── scripts/
│   └── copy-assets.js   # 构建后复制静态资源
├── vite.config.js       # Vite 配置
└── package.json
```

## 功能特性

### 📝 文章管理

- 文章分类浏览
- Markdown 格式文章展示
- 文章标签筛选

### 🎨 界面设计

- 响应式布局，适配桌面端/移动端
- 深色/浅色模式切换
- CSS 变量统一主题配色（主题色 #42b883）
- 卡片式设计，简洁美观

### ⚡ 性能优化

- 路由懒加载
- 构建资源自动哈希
- 文章内容缓存


## 如何添加文章

### 1. 准备文章内容

在 `public/articles/` 目录下创建分类文件夹和文章文件：

```
public/articles/
├── vue/
│   └── 01.html
├── vite/
│   ├── 00.html
│   ├── 01.html
│   └── ...
└── ...
```

### 2. 添加文章元数据

编辑 `src/data/data.js`，在对应分类下添加文章信息：

```javascript
export const articlesData = {
    java: [
        {
            id: '01',
            title: '文章标题',
            category: 'vue',
            tags: ['Vue', '前端'],
            date: '2026-01-01',
            author: '作者',
            image: vueIcon
        }
    ]
}
```

### 3. 构建验证

```bash
npm run build
```

## 配置说明

### 环境变量

创建 `.env` 文件：

```env
VITE_BASE_URL=
```

### CSS 变量

主题配色在 `src/style.css` 中定义，可按需修改：

```css
:root {
    --color-primary: #42b883;
    --color-bg: #f5f5f5;
    --color-text: #333;
    /* ... */
}
```

## 许可证

Apache License 2.0

---

<p align="center">
  <a href="https://github.com/dkbnull">
    <img src="https://img.shields.io/badge/Author-null-42b883?style=flat-square">
  </a>
</p>
