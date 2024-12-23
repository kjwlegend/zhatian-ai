import { Project } from '@stackblitz/sdk';

// 注意：需要动态导入 SDK
async function getStackBlitzSDK() {
  const sdk = await import('@stackblitz/sdk');
  return sdk.default;
}

interface CodeFile {
  content: string;
  language?: string;
}

interface ProjectFiles {
  script?: CodeFile;
  template?: CodeFile;
  style?: CodeFile;
}

type FrameworkType = 'vue' | 'react' | 'ace';

// 添加自定义的 Project 类型来扩展原有的接口
interface CustomProject extends Omit<Project, 'files'> {
  files: {
    [key: string]: string;
  };
}

export class StackBlitzService {
  private static readonly FRAMEWORK_CONFIGS = {
    vue: {
      title: 'Vue Preview',
      description: 'Vue code preview',
      template: 'node',
      dependencies: {
        vue: 'latest',
        '@vitejs/plugin-vue': 'latest',
        vite: 'latest',
        sass: 'latest',
      },
    },
    react: {
      title: 'React Preview',
      description: 'React code preview',
      template: 'node',
      dependencies: {
        react: 'latest',
        'react-dom': 'latest',
        '@vitejs/plugin-react': 'latest',
        vite: 'latest',
        sass: 'latest',
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
        typescript: 'latest',
      },
    },
    ace: {
      title: 'Ace Preview',
      description: 'Ace code preview',
      template: 'node',
      dependencies: {
        vue: '^2.7.0',
        '@vitejs/plugin-vue2': '^2.3.0',
        vite: '^5.0.0',
        sass: 'latest',
      },
    },
  };

  static async openProject(files: ProjectFiles, framework: FrameworkType): Promise<void> {
    try {
      const sdk = await getStackBlitzSDK();
      const config = this.FRAMEWORK_CONFIGS[framework];

      const project: CustomProject = {
        title: config.title,
        description: config.description,
        template: 'node',
        dependencies: config.dependencies,
        files: {
          ...this.createProjectFiles(files, framework),
          'vite.config.js': this.createViteConfig(framework),
          'package.json': this.createPackageJson(framework),
        },
      };

      await sdk.openProject(project, {
        newWindow: true,
        openFile: framework === 'vue' ? 'src/App.vue' : 'src/App.tsx',
      });

      // 使用 embedProject 嵌入项目
      //   await sdk.embedProject('stk-preview-container', project, {
      //     openFile: framework === 'vue' ? 'src/App.vue' : 'src/App.tsx',
      //     height: 600, // 设置嵌入项目的高度
      //   });
    } catch (error) {
      console.error('Failed to open StackBlitz project:', error);
      throw new Error('无法打开预览');
    }
  }

  private static createViteConfig(framework: FrameworkType): string {
    switch (framework) {
      case 'vue':
        return `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})`;
      case 'react':
        return `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})`;
      case 'ace':
        return `
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue2()]
})`;
      default:
        throw new Error('Unsupported framework');
    }
  }

  private static createPackageJson(framework: FrameworkType): string {
    const config = this.FRAMEWORK_CONFIGS[framework];
    return JSON.stringify(
      {
        name: 'stackblitz-preview',
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: config.dependencies,
        devDependencies: {
          ...config.dependencies,
          vite: '^5.0.0',
        },
      },
      null,
      2
    );
  }

  private static createProjectFiles(
    files: ProjectFiles,
    framework: FrameworkType
  ): Record<string, string> {
    if (framework === 'vue') {
      return {
        'src/App.vue': `
${files.template?.content ?? '<div>No template provided</div>'}
${files.style?.content ? `<style src="./style.scss"></style>` : ''}`,
        'src/main.js': `
import { createApp } from 'vue'
import App from './App.vue'
import './style.scss'

createApp(App).mount('#app')`,
        'src/style.scss': files.style?.content ?? '',
        'index.html': `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Preview</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
        `,
      };
    }

    if (framework === 'react') {
      return {
        'src/App.tsx': `
${files.script?.content ? files.script?.content : 'export default function App() { return <div>No content provided</div> }'}
${files.style?.content ? `<style src="./style.scss"></style>` : ''}
`,
        'src/style.scss': `${files.style?.content ? files.style?.content : '/* No styles provided */'}`,
        'src/main.tsx': `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
      `,
        'src/vite-env.d.ts': `/// <reference types="vite/client" />`,
        'index.html': `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Preview</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
      `,
      };
    }

    if (framework === 'ace') {
      return {
        'src/App.vue': `
${files.template?.content ? files.template?.content : '<template><div>No content provided</div></template>'}
${files.style?.content ? `<style src="./style.scss"></style>` : ''}
`,
        'src/panel.js': `${files.script?.content ? files.script?.content : ''}`,
        'src/main.js': `
import Vue from 'vue'
import App from './App.vue'
import './style.scss'

new Vue({
  render: h => h(App)
}).$mount('#app')
        `,
        'src/style.scss': `${files.style?.content ? files.style?.content : ''}`,
        'index.html': `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ace Preview</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
        `,
        'vite.config.js': `
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue2()]
})
        `,
        'public/placeholder1.jpg': '', // 可以添加一些默认图片
        'public/placeholder2.jpg': '',
        'public/placeholder3.jpg': '',
      };
    }

    return {
      'src/App.vue': '',
      'src/main.js': '',
      'src/style.scss': '',
      'index.html': '',
    };
  }
}
