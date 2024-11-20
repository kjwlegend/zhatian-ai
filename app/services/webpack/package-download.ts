import fs from 'fs/promises';
import path from 'path';

interface CodeContent {
  panel: string;
  vue: string;
  index: string;
  style: string;
}

const buildPath = (...paths: string[]): string => path.join(process.cwd(), ...paths);

const FILES_MAP: Record<keyof CodeContent, string> = {
  panel: 'panel.js',
  vue: 'index.vue',
  index: 'index.js',
  style: 'style.scss',
};

/**
 * 从 index.js 文件内容中解析组件名称
 */
function parseComponentName(indexContent: string): string {
  try {
    const match = indexContent.match(/export\s+default\s+{\s*(\w+)/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('Component name not found in index.js');
  } catch (error) {
    console.error('Failed to parse component name:', error);
    throw error;
  }
}

/**
 * 生成组件目录名称
 */
function generateDirectoryName(componentName: string): string {
  return componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export async function createDemoFiles(
  componentName: string,
  codeContent: Record<keyof CodeContent, string>
): Promise<string> {
  try {
    const directoryName = parseComponentName(codeContent.index);
    const componentDir = buildPath('src', 'components', 'lightPage', directoryName);

    await fs.rm(componentDir, { recursive: true, force: true });
    await fs.mkdir(componentDir, { recursive: true });

    await Promise.all([
      fs.writeFile(path.join(componentDir, FILES_MAP.index), codeContent.index),
      fs.writeFile(path.join(componentDir, FILES_MAP.panel), codeContent.panel),
      fs.writeFile(path.join(componentDir, FILES_MAP.vue), codeContent.vue),
    ]);

    console.log(`Files written in directory ${directoryName}`);
    return directoryName;
  } catch (error) {
    console.error('Error creating demo files:', error);
    if (typeof componentName === 'string') {
      await cleanupFiles(componentName).catch(() => {});
    }
    throw error;
  }
}

/**
 * 清理临时文件
 * @param buildId 构建ID
 */
export async function cleanupFiles(buildId: string): Promise<void> {
  try {
    const componentDir = buildPath('src', 'components', 'lightPage', buildId);
    const distFile = buildPath('dist', 'pagebuilder', `${buildId}.js`);

    await Promise.all([
      fs.rm(componentDir, { recursive: true, force: true }),
      fs.rm(distFile, { force: true }),
    ]);

    console.log(`Cleaned up build ${buildId}`);
  } catch (error) {
    console.warn('Cleanup error:', error);
  }
}
