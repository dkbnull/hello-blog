import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录：src/data/articles
const sourceDir = path.join(__dirname, '..', 'src', 'data', 'articles');
// 目标目录：dist/articles
const targetDir = path.join(__dirname, '..', 'dist', 'articles');

// 递归复制目录的函数
function copyDir(src, dest) {
    // 确保目标目录存在
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, {recursive: true});
    }

    // 读取源目录内容
    const entries = fs.readdirSync(src, {withFileTypes: true});

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // 递归复制子目录
            copyDir(srcPath, destPath);
        } else {
            // 复制文件
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 复制整个articles目录到dist/assets目录下
function copyArticlesAssets() {
    try {
        if (!fs.existsSync(sourceDir)) {
            console.log('⚠️  源目录不存在:', sourceDir);
            return;
        }

        copyDir(sourceDir, targetDir);
        console.log('✅ 成功复制articles静态资源到dist目录');
    } catch (error) {
        console.error('❌ 复制articles静态资源失败:', error);
    }
}

// 执行复制操作
copyArticlesAssets();