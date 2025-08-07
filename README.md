# 🤖 AI Chat to Code - 智能全栈开发助手

<div align="center">

[![License](https://img.shields.io/badge/License-Apache%203.0-blue.svg)](https://opensource.org/licenses/Apache-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-supported-blue)](https://www.docker.com/)

**基于AI的智能全栈开发辅助系统 - 通过自然语言交互，助力团队快速构建高质量应用**

[🚀 快速开始](#-快速开始) • [📖 文档](./docs) • [🎯 演示](#-功能演示) • [🛠️ 开发指南](#-开发指南)

</div>

## ✨ 核心特性

### 🎯 四大核心模块

<table>
<tr>
<td width="50%">

**🔍 售前支持 (BD Assistant)**

- 📊 历史投标检索与智能分析
- 📰 品牌新闻实时分析
- 📝 投标方案智能评估
- 🎤 演讲稿生成与演练指导

**🧠 需求分析 (Requirements)**

- 📋 业务需求智能分析
- 🎨 设计稿一键转代码
- ⚡ 快速需求文档生成
- 📄 产品文档自动撰写

</td>
<td width="50%">

**⚙️ 开发辅助 (Development)**

- 🎛️ 前端框架代码智能生成
- 🗄️ 宝塔UNEX/LIGHT配置
- 🔌 UNEX接口生成与对接
- 🧪 测试用例与脚本自动生成

**🚀 运营支持 (Operations)**

- 📝 自然语言内容快速生成
- 💬 客服话术智能演练
- 📊 数据分析报告生成

</td>
</tr>
</table>

### 🏗️ 技术架构优势

- **🎯 框架集成**: ACE/UNEX框架深度集成，支持Vue、React、Python、Node.js、Java
- **📚 知识沉淀**: BD方法论、组件库、技术经验持续积累
- **🤖 AI调优**: 输出模板、工作流链路、思维链深度优化
- **🔧 CMS集成**: WordPress、Drupal等CMS框架标准对接

## 🚀 快速开始

### 📋 环境要求

- Node.js >= 18.0.0
- Docker & Docker Compose (推荐)
- Git

### ⚡ 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/your-org/ai-chat-to-code.git
cd ai-chat-to-code

# 2. 安装依赖
npm install
# 或使用 pnpm (推荐)
pnpm install

# 3. 环境配置
cp .env.example .env.local
# 编辑 .env.local 配置必要的API密钥

# 4. 启动开发服务器
npm run dev
```

### 🐳 Docker 部署

```bash
# 开发环境
docker-compose up -d

# 生产环境
docker-compose -f docker-compose.prod.yml up -d
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用！

## 🛠️ 技术栈

### 前端技术

```typescript
- Framework: Next.js 14 (App Router)
- Language: TypeScript 5.0+
- Styling: Tailwind CSS + Shadcn UI
- Animation: Framer Motion
- State: Zustand + React Query
- Testing: Jest + React Testing Library
```

### 后端技术

```python
- Runtime: Node.js / Python
- Framework: Express.js / Flask
- Database: MySQL + Redis
- Vector DB: Milvus
- Gateway: OpenResty
- Container: Docker + Kubernetes
```

### AI & 集成

```yaml
- LLM APIs: OpenAI GPT-4, Dify
- Vector Search: Milvus + Embedding
- Framework Integration: ACE/UNEX
- CMS Support: WordPress, Drupal
```

## 🎯 功能演示

### 💼 售前BD助手

```mermaid
graph LR
    A[历史投标数据] --> B[AI分析]
    B --> C[方案评估]
    C --> D[演讲稿生成]
    D --> E[实战演练]
```

### 🎨 需求转代码

```mermaid
graph TD
    A[设计稿上传] --> B[元素识别]
    B --> C[组件拆解]
    C --> D[代码生成]
    D --> E[预览调试]
```

## 📁 项目结构

app/
├── agents/ # 项目智能助手
├── bd/ # 售前支持模块
├── codes/ # 代码生成模块
├── workspace/ # 工作区管理
├── components/ # 公共组件
├── services/ # 后端服务
└── store/ # 状态管理
components/ # UI组件库
docs/ # 文档资源

## 🔧 开发指南

### 📜 可用脚本

| 命令                | 说明               |
| ------------------- | ------------------ |
| `npm run dev`       | 启动开发服务器     |
| `npm run build`     | 构建生产版本       |
| `npm run test`      | 运行所有测试       |
| `npm run lint`      | 代码规范检查       |
| `npm run typecheck` | TypeScript类型检查 |

### 🌍 环境变量

```bash
# OpenAI配置
OPENAI_API_KEY=your_openai_key
OPENAI_BASE_URL=https://api.openai.com/v1

# Dify配置
DIFY_API_KEY=your_dify_key
DIFY_BASE_URL=https://api.dify.ai/v1

# 数据库配置
DATABASE_URL=mysql://user:pass@localhost:3306/db
REDIS_URL=redis://localhost:6379
```

## 🏛️ 系统架构

### 🎯 整体架构图

![Architecture Diagram](./docs/bombai-architecture.png)

<details>
<summary>📊 详细架构图</summary>

```mermaid
graph TB
    subgraph "🖥️ 前端层"
        A[Next.js App Router]
        B[TypeScript + Tailwind]
        C[Shadcn UI Components]
        D[Zustand Store]
    end

    subgraph "🔀 网关层"
        E[OpenResty Gateway]
        F[Nginx Load Balancer]
    end

    subgraph "⚙️ 服务层"
        G[Express.js API]
        H[Flask Python Service]
        I[AI Processing Service]
    end

    subgraph "💾 数据层"
        J[(MySQL Database)]
        K[(Redis Cache)]
        L[(Milvus Vector DB)]
        M[(Ali OSS Storage)]
    end

    subgraph "🤖 AI层"
        N[OpenAI GPT-4]
        O[Dify Platform]
        P[Custom Models]
    end

    A --> E
    E --> F
    F --> G
    F --> H
    G --> I
    H --> I
    I --> N
    I --> O
    I --> P
    G --> J
    G --> K
    H --> L
    G --> M
```

</details>

## 🤝 贡献指南

我们欢迎所有形式的贡献！请在提交PR前确保：

- ✅ 通过所有测试 (`npm run test`)
- ✅ 符合代码规范 (`npm run lint`)
- ✅ 更新相关文档
- ✅ 添加必要的测试用例

### 🔄 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📋 开发路线图

### 🎯 近期计划 (Q1 2024)

- [ ] 🧩 组件上传与验证功能
- [ ] 👁️ 实时代码预览功能
- [ ] 📚 组件库优化升级
- [ ] 🎨 页面部分预览功能
- [ ] 🔍 智能代码搜索

### 🚀 长期规划 (2024)

- [ ] 🌐 多语言国际化支持
- [ ] 📱 移动端适配优化
- [ ] 🔌 更多第三方集成
- [ ] 🤖 自定义AI模型训练
- [ ] ☁️ 云端部署方案

## 📄 许可证

本项目采用 [Apache 3.0 License](./LICENSE) 开源协议。

## 🙋‍♂️ 支持与反馈

- 📧 邮箱: support@your-domain.com
- 💬 讨论: [GitHub Discussions](https://github.com/your-org/ai-chat-to-code/discussions)
- 🐛 Bug报告: [GitHub Issues](https://github.com/your-org/ai-chat-to-code/issues)
- 📖 文档: [在线文档](https://docs.your-domain.com)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个星标！**

Made with ❤️ by [Your Team Name](https://github.com/your-org)

</div>
