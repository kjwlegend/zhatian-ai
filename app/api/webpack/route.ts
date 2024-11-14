import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createDemoFiles } from '@/app/services/webpack/package-download';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { currentTopic, topicCode } = req.body;
  console.error('Received in API:', { currentTopic, topicCode });

  if (!currentTopic) {
    return res.status(400).json({ message: 'Missing currentTopic in request body' });
  }

  try {
    // 使用传递过来的 topicCode
    try {
      await createDemoFiles(currentTopic, topicCode);
    } catch (error) {
      console.error('%c  createDemoFiles', 'background-image:color:transparent;color:red;');
      console.error('🚀~ => ', error);
    }
    // 运行 build:packages 脚本
    const { stdout, stderr } = await execAsync('pnpm run build:packages');
    //  打包完成 successfully
    console.error('%c stderr.includes ', 'background-image:color:transparent;color:red;');
    console.error('🚀~ => ', stdout.includes('successfully'));
    console.error('%c  ====================== ', 'background-image:color:transparent;color:red;');

    console.error('🚀~ => ', stderr);
    console.error('%c ====================== ', 'background-image:color:transparent;color:red;');

    console.error('🚀~ => ', stdout);

    if (stdout.includes('successfully')) {
      console.log(`Build output: ${stdout}`);
      return res.status(200).json({ message: 'Demo files created and package built successfully' });
    }
    console.error(`Build error: ${stderr}`);
    return res.status(500).json({ message: 'Error during build', error: stderr });
  } catch (error) {
    console.error('Error during demo files creation or build:', error);
    res.status(500).json({
      message: 'Error during demo files creation or build',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
