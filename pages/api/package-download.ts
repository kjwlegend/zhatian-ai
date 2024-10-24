import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

import { CodeContent } from '@/app/services/db/schema'
// import { useChatStore } from '@/app/store/chatStore'
// const { getTopicCode, currentTopic } = useChatStore();

const execAsync = promisify(exec)

/**
 * 构建一个绝对路径
 * @param {...string} paths - 路径片段
 * @returns {string} 完整的绝对路径
 */
const buildPath = (...paths: string[]): string => path.join(process.cwd(), ...paths)

/**
 * 创建演示文件
 * @param {string} currentTopic - 当前主题
 */
async function createDemoFiles(currentTopic: string) {
    const demoDir = buildPath('components-light', 'demo')

    await fs.rm(demoDir, { recursive: true, force: true })
    await fs.mkdir(demoDir, { recursive: true })

    const files = [
        { type: 'html', fileName: 'index.vue' },
        { type: 'index', fileName: 'index.js' },
        { type: 'panel', fileName: 'panel.js' },
        { type: 'scss', fileName: 'index.scss' }
    ]

    await Promise.all(files.map(async ({ type, fileName }) => {
        const getTopicCode = useChatStore().getTopicCode
        const content = await getTopicCode(currentTopic, type as keyof CodeContent)
        console.error('content',content)
        await fs.writeFile(path.join(demoDir, fileName), content)
    }))
}

/**
 * 复制构建文件到目标目录
 */
async function copyBuildFiles() {
    const buildDir = buildPath('components-light', 'Banner')
    const distDir = buildPath('dist', 'pagebuilder')

    await fs.mkdir(distDir, { recursive: true })

    const folders = await fs.readdir(buildDir)

    for (const folder of folders) {
        const sourcePath = path.join(buildDir, folder)
        const destPath = path.join(distDir, folder)

        const stats = await fs.stat(sourcePath)
        if (stats.isDirectory()) {
            await fs.cp(sourcePath, destPath, { recursive: true })
            console.log(`Copied ${folder} to ${destPath}`)
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const currentTopic = useChatStore().currentTopic
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    try {
        await createDemoFiles(currentTopic)

        // const { stdout, stderr } = await execAsync('npx webpack --config webpack.config.js')

        // if (stderr) {
        //     console.error(`Webpack build error: ${stderr}`)
        //     return res.status(500).json({ message: 'Error during webpack build', error: stderr })
        // }

        // await copyBuildFiles()

        // console.log(`Webpack build output: ${stdout}`)
        res.status(200).json({ message: 'Package built and copied successfully' })
    } catch (error) {
        console.error('Error during package build:', error)
        res.status(500).json({ message: 'Error during package build', error: error instanceof Error ? error.message : String(error) })
    }
}
