// 分类和文章数据

// 分类数据
export const categoriesData = [
    {id: 'java', name: 'Java'},
    {id: 'springboot', name: 'Spring Boot'},
    {id: 'springcloud', name: 'Spring Cloud'}
];

// 文章数据
export const articlesData = {
    java: [
        {
            id: '01',
            title: 'Java使用JNA方式调用DLL',
            category: 'java',
            date: '2020-03-22',
            image: new URL('../assets/java.png', import.meta.url).href
        }
    ],
    springboot: [
        {
            id: '00',
            title: '深入理解Spring两大特性：IoC和AOP',
            category: 'springboot',
            date: '2019-02-14',
            image: new URL('../assets/springboot.png', import.meta.url).href
        }
    ]
};