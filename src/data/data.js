/**
 * 分类和文章数据
 */

// 导入图片资源
import frontendIcon from '../assets/frontend.svg';
import backendIcon from '../assets/backend.svg';

/**
 * 分类数据
 */
export const categoriesData = [
    {id: 'frontend', name: '前端开发', icon: '💻'},
    {id: 'backend', name: '后端开发', icon: '🖥️'},
];

/**
 * 文章数据
 */
export const articlesData = {
    frontend: [
        {
            id: '1',
            title: 'Vue 3 新特性详解',
            category: 'frontend',
            tags: ['Vue', '前端', 'JavaScript'],
            date: '2023-05-15',
            author: '张三',
            image: frontendIcon
        },
        {
            id: '2',
            title: 'TypeScript 入门指南',
            category: 'frontend',
            tags: ['TypeScript', '前端', 'JavaScript'],
            date: '2023-06-20',
            author: '李四',
            image: frontendIcon
        }
    ],
    backend: [
        {
            id: '3',
            title: 'Node.js 性能优化技巧',
            category: 'backend',
            tags: ['Node.js', '后端', '性能优化'],
            date: '2023-07-10',
            author: '王五',
            image: backendIcon
        }
    ]
};