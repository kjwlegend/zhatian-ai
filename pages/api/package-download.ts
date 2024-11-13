import { exec } from 'child_process'
import fs from 'fs/promises'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promisify } from 'util'

import { CodeContent } from '@/app/services/db/schema'
import { entryTemplate, panelTemplate, vueTemplate } from '@/template/light'

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
 * @param {Record<keyof CodeContent, string>} topicCode - 主题代码内容
 */
async function createDemoFiles(currentTopic: string, topicCode: Record<keyof CodeContent, string>): Promise<void> {
    const defaultComponentName = 'demo'
    const demoDir = buildPath('components-light', defaultComponentName)

    // 清理并创建目录
    await fs.rm(demoDir, { recursive: true, force: true })
    await fs.mkdir(demoDir, { recursive: true })

    // 生成入口文件
    await fs.writeFile(
        path.join(demoDir, 'index.js'),
        entryTemplate(defaultComponentName)
    )

    // TODO 生成面板配置文件 后续修改
    await fs.writeFile(
        path.join(demoDir, 'panel.js'),
        panelTemplate()
    )

    // 生成其他文件
    await Promise.all(CUSTOM_TABS.map(async (type) => {
        try {
            const content = topicCode[type]
            if (!content) {
                console.warn(`Content for type ${type} is undefined`)
                return
            }
            const filePath = path.join(demoDir, FILES_MAP[type])

            switch (type) {
                case 'html':
                    await fs.writeFile(filePath, vueTemplate(defaultComponentName, content))
                    break
                case 'scss':
                case 'panel':
                    await fs.writeFile(filePath, content)
                    break
                case 'js':
                    // 跳过js文件,因为已经生成了入口文件
                    break
            }
            console.log(`File written: ${FILES_MAP[type]}`)
        } catch (error) {
            console.error(`Error writing ${type} file:`, error)
            throw error // 向上传播错误
        }
    }))
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
        try {
            await createDemoFiles(currentTopic, topicCode)
        } catch (error) {
            console.error('%c  createDemoFiles', 'background-image:color:transparent;color:red;');
            console.error('🚀~ => ', error);
        }
        // 运行 build:packages 脚本
        const { stdout, stderr } = await execAsync('pnpm run build:packages')
        //  打包完成 successfully
        console.error('%c stderr.includes ', 'background-image:color:transparent;color:red;');
        console.error('🚀~ => ', stdout.includes('successfully'));
        console.error('%c  ====================== ', 'background-image:color:transparent;color:red;');

        console.error('🚀~ => ', stderr);
        console.error('%c ====================== ', 'background-image:color:transparent;color:red;');

        console.error('🚀~ => ', stdout);

        if (stdout.includes('successfully')) {
            console.log(`Build output: ${stdout}`)
            return res.status(200).json({ message: 'Demo files created and package built successfully' })
        }
        console.error(`Build error: ${stderr}`)
        return res.status(500).json({ message: 'Error during build', error: stderr })

    } catch (error) {
        console.error('Error during demo files creation or build:', error)
        res.status(500).json({
            message: 'Error during demo files creation or build',
            error: error instanceof Error ? error.message : String(error)
        })
    }
}
