import fs from 'fs/promises';
import path from 'path';
import { CodeContent } from '@/app/services/db/schema';
import { entryTemplate, panelTemplate, vueTemplate } from '@/app/services/webpack/template/light';

/**
 * 构建一个绝对路径
 * @param {...string} paths - 路径片段
 * @returns {string} 完整的绝对路径
 */
const buildPath = (...paths: string[]): string => path.join(process.cwd(), ...paths);

const FILES_MAP: Record<keyof CodeContent, string> = {
  html: 'index.vue',
  js: 'index.js',
  scss: 'index.scss',
  panel: 'panel.js',
};

const CUSTOM_TABS: (keyof CodeContent)[] = ['html', 'js', 'scss', 'panel'];

/**
 * 创建演示文件
 * @param {string} currentTopic - 当前主题
 * @param {Record<keyof CodeContent, string>} topicCode - 主题代码内容
 */
export async function createDemoFiles(
  currentTopic: string,
  topicCode: Record<keyof CodeContent, string>
): Promise<void> {
  const defaultComponentName = 'demo';
  const demoDir = buildPath('components-light', defaultComponentName);

  // 清理并创建目录
  await fs.rm(demoDir, { recursive: true, force: true });
  await fs.mkdir(demoDir, { recursive: true });

  // 生成入口文件
  await fs.writeFile(path.join(demoDir, 'index.js'), entryTemplate(defaultComponentName));

  // TODO 生成面板配置文件 后续修改
  await fs.writeFile(path.join(demoDir, 'panel.js'), panelTemplate());

  // 生成其他文件
  await Promise.all(
    CUSTOM_TABS.map(async (type) => {
      try {
        const content = topicCode[type];
        if (!content) {
          console.warn(`Content for type ${type} is undefined`);
          return;
        }
        const filePath = path.join(demoDir, FILES_MAP[type]);

        switch (type) {
          case 'html':
            await fs.writeFile(filePath, vueTemplate(defaultComponentName, content));
            break;
          case 'scss':
          case 'panel':
            await fs.writeFile(filePath, content);
            break;
          case 'js':
            // 跳过js文件,因为已经生成了入口文件
            break;
        }
        console.log(`File written: ${FILES_MAP[type]}`);
      } catch (error) {
        console.error(`Error writing ${type} file:`, error);
        throw error; // 向上传播错误
      }
    })
  );
}

async function copyBuildFiles(): Promise<void> {
  const buildDir = buildPath('components-light', 'demo');
  const distDir = buildPath('dist', 'pagebuilder');

  await fs.mkdir(distDir, { recursive: true });

  const folders = await fs.readdir(buildDir);

  await Promise.all(
    folders.map(async (folder) => {
      const sourcePath = path.join(buildDir, folder);
      const destPath = path.join(distDir, folder);

      const stats = await fs.stat(sourcePath);
      if (stats.isDirectory()) {
        await fs.cp(sourcePath, destPath, { recursive: true });
        console.log(`Copied ${folder} to ${destPath}`);
      }
    })
  );
}
