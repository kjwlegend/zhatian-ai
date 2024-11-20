import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { cleanupFiles, createDemoFiles } from '@/app/services/webpack/package-download';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  let buildId: string | undefined;

  try {
    const body = await request.json();
    const { componentName, frontendCode } = body;

    if (!componentName || !frontendCode) {
      return NextResponse.json(
        { message: 'Missing required fields: componentName and frontendCode' },
        { status: 400 }
      );
    }

    // 确保前端代码包含所需的文件
    const requiredFiles = ['panel', 'vue', 'index'];
    const missingFiles = requiredFiles.filter((file) => !frontendCode[file]);

    if (missingFiles.length > 0) {
      return NextResponse.json(
        { message: `Missing required files: ${missingFiles.join(', ')}` },
        { status: 400 }
      );
    }

    // 创建组件文件，获取构建ID
    buildId = await createDemoFiles(componentName, frontendCode);
    // 运行构建脚本
    const { stdout, stderr } = await execAsync('npm run build:packages');

    if (stdout.includes('successfully')) {
      // 读取打包后的文件
      const distPath = path.join(process.cwd(), 'dist', 'pagebuilder', `${buildId}.js`);
      const fileContent = await fs.readFile(distPath);

      // 创建包含文件内容的 Response
      const response = new NextResponse(fileContent);
      response.headers.set('Content-Type', 'application/javascript');
      response.headers.set('Content-Disposition', `attachment; filename="${componentName}.js"`);

      // 下载完成后清理文件
      // await cleanupFiles(buildId);

      return response;
    }

    console.error(`Build error: ${stderr}`);
    return NextResponse.json({ message: 'Error during build', error: stderr }, { status: 500 });
  } catch (error) {
    console.error('%c error ', 'background-image:color:transparent;color:red;');
    console.error('🚀~ => ', error);
    // 确保在错误时也清理文件
    if (buildId) {
      // await cleanupFiles(buildId).catch(console.error);
    }

    console.error('Error during component files creation or build:', error);
    return NextResponse.json(
      {
        message: 'Error during component files creation or build',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
