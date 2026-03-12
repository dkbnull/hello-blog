// 分类和文章数据

// 分类数据
export const categoriesData = [
    {id: 'frontend', name: '前端开发', icon: '💻'},
    {id: 'backend', name: '后端开发', icon: '🖥️'},
];

// 文章数据
export const articlesData = {
    frontend: [
        {
            id: '1',
            title: 'Vue 3 新特性详解',
            content: '# Vue 3 新特性详解\n\nVue 3 带来了许多令人兴奋的新特性，包括组合式 API、Teleport、Suspense 等。本文将详细介绍这些新特性的使用方法和优势。\n\n## 组合式 API\n\n组合式 API 是 Vue 3 中最显著的变化之一，它允许我们按照逻辑关注点组织代码，而不是按照选项类型。\n\n```javascript\n// 使用组合式 API\nimport { ref, computed } from \'frontend\'\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubleCount = computed(() => count.value * 2)\n    \n    function increment() {\n      count.value++\n    }\n    \n    return {\n      count,\n      doubleCount,\n      increment\n    }\n  }\n}\n```\n\n## Teleport\n\nTeleport 允许我们将组件的内容渲染到 DOM 树中的任何位置，这对于模态框、通知等组件非常有用。\n\n## Suspense\n\nSuspense 允许我们在组件加载完成前显示占位内容，提供更好的用户体验。',
            category: 'frontend',
            tags: ['Vue', '前端', 'JavaScript'],
            date: '2023-05-15',
            author: '张三',
            image: new URL('../assets/frontend.svg', import.meta.url).href
        },
        {
            id: '2',
            title: 'TypeScript 入门指南',
            content: '# TypeScript 入门指南\n\nTypeScript 是 JavaScript 的超集，它添加了静态类型检查和其他高级特性，使代码更加健壮和可维护。\n\n## 类型系统\n\nTypeScript 的核心特性是其类型系统，它允许我们为变量、函数参数和返回值指定类型。\n\n```typescript\n// 基本类型\nlet isDone: boolean = false;\nlet age: number = 18;\nlet name: string = "张三";\n\n// 接口\ninterface Person {\n  name: string;\n  age: number;\n}\n\n// 函数\nfunction greet(person: Person): string {\n  return `Hello, ${person.name}!`;\n}\n```\n\n## 泛型\n\n泛型允许我们编写可重用的代码，适用于多种类型。',
            category: 'frontend',
            tags: ['TypeScript', '前端', 'JavaScript'],
            date: '2023-06-20',
            author: '李四',
            image: new URL('../assets/frontend.svg', import.meta.url).href
        }
    ],
    backend: [
        {
            id: '3',
            title: 'Node.js 性能优化技巧',
            content: '# Node.js 性能优化技巧\n\nNode.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，用于构建高性能的网络应用。本文将介绍一些 Node.js 性能优化的技巧。\n\n## 代码优化\n\n1. 使用异步 I/O\n2. 避免同步操作\n3. 使用合适的数据结构\n4. 优化内存使用\n\n## 工具和监控\n\n1. 使用 PM2 进行进程管理\n2. 使用 New Relic 或 Datadog 进行监控\n3. 使用 Node.js 内置的 profiler 进行性能分析',
            category: 'backend',
            tags: ['Node.js', '后端', '性能优化'],
            date: '2023-07-10',
            author: '王五',
            image: new URL('../assets/backend.svg', import.meta.url).href
        }
    ]
};