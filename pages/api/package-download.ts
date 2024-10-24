import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { ChatMessage, useChatStore } from '@/app/store/chatStore'


/**
 * 构建一个绝对路径
 * @param {...string} paths - 路径片段
 * @returns {string} 完整的绝对路径
 */
function buildPath(...paths: string[]): string {
    return path.join(process.cwd(), ...paths);
}

const execAsync = promisify(exec);

async function createDemoFiles(currentTopic: string) {
    const getTopicCode = useChatStore.getState().getTopicCode

    const demoDir = buildPath('components-light', 'demo')
    // 先删除 demo 文件夹（如果存在）
    await fs.rm(demoDir, { recursive: true, force: true })
    // 确保 demo 目录存在
    await fs.mkdir(demoDir, { recursive: true })

    const files = [
        { type: 'html', fileName: 'index.vue' },
        { type: 'index', fileName: 'index.js' },
        { type: 'panel', fileName: 'panel.js' },
        { type: 'scss', fileName: 'index.scss' }
    ]

    await Promise.all(files.map(async ({ type, fileName }) => {
        const content = getTopicCode(currentTopic, type as keyof ChatMessage['code'])
        await fs.writeFile(path.join(demoDir, fileName), content)
    }))
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    try {
        // 首先创建 demo 文件
        const currentTopic = useChatStore.getState().currentTopic
        await createDemoFiles(currentTopic)

        // 然后执行打包脚本
        const { stdout, stderr } = await execAsync('npx webpack --config webpack.config.js')
        console.error(stdout, stderr)
        // 获取打包后的文件路径
        const buildDir = buildPath('components-light', 'Banner')
        const distDir = buildPath('dist', 'pagebuilder')

        // 确保目标目录存在
        await fs.mkdir(distDir, { recursive: true })

        // 获取打包后的文件夹名称
        const folders = await fs.readdir(buildDir)

        for (const folder of folders) {
            const sourcePath = path.join(buildDir, folder)
            const destPath = path.join(distDir, folder)

            // 检查是否为目录
            const stats = await fs.stat(sourcePath)
            if (stats.isDirectory()) {
                // 复制整个文件夹到目标目录
                await fs.cp(sourcePath, destPath, { recursive: true })
                console.log(`Copied ${folder} to ${destPath}`)
            }
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`)
            return res.status(500).json({ message: '打包过程中出现错误' })
        }

        console.log(`stdout: ${stdout}`)
        res.status(200).json({ message: '打包成功' })
    } catch (error) {
        console.error('执行出错:', error)
        res.status(500).json({ message: '打包过程中出现错误' })
    }
}
