import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

import { CodeContent } from '@/app/services/db/schema'
import { useChatStore } from '@/app/store/chatStore'

const execAsync = promisify(exec);

/**
 * 构建一个绝对路径
 * @param {...string} paths - 路径片段
 * @returns {string} 完整的绝对路径
 */
const buildPath = (...paths: string[]): string => path.join(process.cwd(), ...paths)

const FILES_MAP: Record<keyof CodeContent, string> = {
    html: 'index.vue',
    js: 'index.js',
    scss: 'index.scss',
    panel: 'panel.js'
}

const CUSTOM_TABS: (keyof CodeContent)[] = ['html', 'js', 'scss', 'panel']

/**
 * 创建演示文件
 * @param {string} currentTopic - 当前主题
 */
async function createDemoFiles(currentTopic: string, topicCode: any): Promise<void> {
    const demoDir = buildPath('components-light', 'demo')
    console.error('Creating demo files for topic:', currentTopic);
    console.error('Topic code:', topicCode);

    await fs.rm(demoDir, { recursive: true, force: true })
    await fs.mkdir(demoDir, { recursive: true })

    const fileWritePromises = CUSTOM_TABS.map(async (type) => {
        try {
            const content = topicCode[type]
            console.error(`Content for ${type}:`, content);
            if (content === undefined) {
                console.warn(`Content for type ${type} is undefined`)
                return
            }
            await fs.writeFile(path.join(demoDir, FILES_MAP[type]), content)
            console.error(`File written for ${type}`);
        } catch (error) {
            console.error(`Error writing file for ${type}:`, error)
        }
    })

    await Promise.all(fileWritePromises)
}

async function copyBuildFiles(): Promise<void> {
    const buildDir = buildPath('components-light', 'demo')
    const distDir = buildPath('dist', 'pagebuilder')

    await fs.mkdir(distDir, { recursive: true })

    const folders = await fs.readdir(buildDir)

    await Promise.all(folders.map(async (folder) => {
        const sourcePath = path.join(buildDir, folder)
        const destPath = path.join(distDir, folder)

        const stats = await fs.stat(sourcePath)
        if (stats.isDirectory()) {
            await fs.cp(sourcePath, destPath, { recursive: true })
            console.log(`Copied ${folder} to ${destPath}`)
        }
    }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
    const { currentTopic, topicCode } = req.body
    console.error('Received in API:', { currentTopic, topicCode });

    if (!currentTopic) {
        return res.status(400).json({ message: 'Missing currentTopic in request body' })
    }

    try {
        // 使用传递过来的 topicCode
        await createDemoFiles(currentTopic, topicCode)

        // 运行 build:packages 脚本
        const { stdout, stderr } = await execAsync('pnpm run build:packages')
        if (stderr) {
            console.error(`Build error: ${stderr}`)
            return res.status(500).json({ message: 'Error during build', error: stderr })
        }
        console.log(`Build output: ${stdout}`)

        res.status(200).json({ message: 'Demo files created and package built successfully' })
    } catch (error) {
        console.error('Error during demo files creation or build:', error)
        res.status(500).json({
            message: 'Error during demo files creation or build',
            error: error instanceof Error ? error.message : String(error)
        })
    }
}
