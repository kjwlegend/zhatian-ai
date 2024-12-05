'use client';

import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    category: '基础使用',
    items: [
      {
        question: '如何开始使用这个系统?',
        answer:
          '使用本系统只需简单几步:\n\n' +
          '1. 注册/登录账号\n' +
          '2. 选择工作区(前端/后端/BD/测试)\n' +
          '3. 上传设计稿或输入需求描述\n' +
          '4. 开始与AI助手对话\n' +
          '5. 获取生成的代码或文档',
      },
      {
        question: '系统支持哪些主要功能?',
        answer:
          '系统提供全方位的开发支持:\n\n' +
          '• 代码生成 - 支持多种框架的代码生成\n' +
          '• 需求分析 - 智能分析设计稿和需求文档\n' +
          '• BD助手 - 辅助生成标书和演讲稿\n' +
          '• 测试用例 - 自动生成测试用例和文档',
      },
    ],
  },
  {
    category: '技术支持',
    items: [
      {
        question: '支持哪些开发框架?',
        answer:
          '我们支持主流的开发技术栈:\n\n' +
          '前端框架:\n' +
          '• React/Next.js\n' +
          '• Vue/Nuxt.js\n' +
          '• 宝塔 ACE/UNEX\n\n' +
          '后端技术:\n' +
          '• Node.js\n' +
          '• Python\n' +
          '• Java',
      },
      {
        question: '如何确保代码质量?',
        answer:
          '我们采用多重质量保证机制:\n\n' +
          '• 代码规范检查\n' +
          '• TypeScript 类型检查\n' +
          '• 自动化测试生成\n' +
          '• 性能优化建议\n' +
          '• 安全漏洞扫描',
      },
    ],
  },
  {
    category: 'BD支持',
    items: [
      {
        question: 'BD助手能提供哪些帮助?',
        answer:
          'BD助手提供全面的售前支持:\n\n' +
          '• 竞品分析报告生成\n' +
          '• 投标文档智能撰写\n' +
          '• 项目方案结构建议\n' +
          '• 演讲稿生成与优化\n' +
          '• 报价策略建议',
      },
      {
        question: '如何使用演讲稿功能?',
        answer:
          '演讲稿生成流程:\n\n' +
          '1. 输入项目基本信息\n' +
          '2. 选择演讲风格和时长\n' +
          '3. 系统生成初稿\n' +
          '4. 交互式优化内容\n' +
          '5. 导出最终稿件',
      },
    ],
  },
  {
    category: '项目管理',
    items: [
      {
        question: '如何管理多个项目?',
        answer:
          '项目管理功能包括:\n\n' +
          '• 项目分类管理\n' +
          '• 团队协作支持\n' +
          '• 版本历史记录\n' +
          '• 组件库管理\n' +
          '• 文档自动归档',
      },
      {
        question: '支持团队协作吗?',
        answer:
          '完整的团队协作功能:\n\n' +
          '• 角色权限管理\n' +
          '• 实时协作编辑\n' +
          '• 评论和反馈\n' +
          '• 任务分配追踪\n' +
          '• 团队活动日志',
      },
    ],
  },
];

export default function Faq() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          常见问题解答
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          我们收集了用户最常见的问题和答案，希望能帮助您更好地使用我们的系统。如果没有找到您需要的答案，请随时联系我们的支持团队。
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <QuestionMarkCircledIcon className="w-5 h-5 mr-2 text-blue-500" />
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem
                    key={itemIndex}
                    value={`item-${categoryIndex}-${itemIndex}`}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <AccordionTrigger className="text-left hover:text-blue-600 transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 whitespace-pre-line">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500">
          还有其他问题?
          <a href="/contact" className="text-blue-600 hover:text-blue-800 ml-1">
            联系我们的支持团队
          </a>
        </p>
      </div>
    </div>
  );
}
