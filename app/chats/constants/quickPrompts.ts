interface QuickPrompt {
  title: string;
  content: string;
}

export const REQUIREMENT_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: '功能需求',
    content: '请根据设计稿帮我分析功能需求，包括每个功能点的详细描述和技术要求。',
  },
  {
    title: '组件设计',
    content: '请根据设计稿帮我设计可复用的组件，包括组件结构、接口设计和技术实现方案。',
  },
  {
    title: '系统架构',
    content: '请根据设计稿帮我设计系统架构，包括模块划分、数据流转、性能优化等方面的考虑。',
  },
  {
    title: 'API设计',
    content: '请根据设计稿帮我设计RESTful API，包括接口定义、安全性、可扩展性和版本控制等方面。',
  },
];

export const FRONTEND_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: '页面组件',
    content: '请根据需求文档帮我实现页面组件，使用React和TypeScript，并考虑响应式设计和用户交互。',
  },
  {
    title: '状态管理',
    content: '请根据需求文档帮我设计状态管理方案，使用React Context或Redux实现数据流转和状态更新。',
  },
  {
    title: '表单处理',
    content: '请根据需求文档帮我实现表单功能，包括数据验证、状态管理和提交处理等完整流程。',
  },
  {
    title: '性能优化',
    content: '请根据需求文档帮我优化前端性能，包括渲染优化、资源加载和缓存策略等方面。',
  },
];

export const BACKEND_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: 'CRUD接口',
    content: '请根据需求文档帮我实现CRUD接口，包括参数验证、错误处理和业务逻辑实现。',
  },
  {
    title: '数据库设计',
    content: '请根据需求文档帮我设计数据库结构，包括表设计、关系定义和性能优化方案。',
  },
  {
    title: '认证授权',
    content: '请根据需求文档帮我实现认证授权系统，包括安全机制、权限控制和性能优化。',
  },
  {
    title: '缓存策略',
    content: '请根据需求文档帮我设计缓存方案，包括缓存策略、更新机制和一致性保证。',
  },
];

export const TEST_CASE_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: '功能测试用例',
    content: '请根据需求文档编写功能测试用例，包括正常流程、边界条件和异常场景的验证。',
  },
  {
    title: '接口测试用例',
    content: '请根据需求文档设计接口测试用例，包括各种输入组合的验证和异常处理测试。',
  },
  {
    title: '流程测试用例',
    content: '请根据需求文档编写业务流程测试用例，覆盖所有关键节点和分支场景。',
  },
  {
    title: '性能测试用例',
    content: '请根据需求文档设计性能测试用例，包括性能指标定义和验收标准。',
  },
];

export const JIRA_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: '功能开发',
    content: '请根据需求文档帮我创建功能开发的JIRA卡片，包含验收标准。',
  },
  {
    title: 'Bug修复',
    content: '请根据需求文档帮我创建Bug修复的JIRA卡片，包含问题描述和修复方案。',
  },
  {
    title: '技术改造',
    content: '请根据需求文档帮我创建技术改造的JIRA卡片，包含改造方案和风险评估。',
  },
  {
    title: '性能优化',
    content: '请根据需求文档帮我创建性能优化的JIRA卡片，包含优化目标和具体指标。',
  },
];

export const TEST_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: '单元测试生成',
    content: '请根据需求文档帮我生成单元测试代码，包括正常流程和异常情况的测试。',
  },
  {
    title: '集成测试生成',
    content: '请根据需求文档帮我编写集成测试，覆盖完整的功能流程和异常处理。',
  },
  {
    title: '测试用例转换',
    content: '请根据需求文档帮我将测试用例转换为自动化测试代码。',
  },
  {
    title: '测试覆盖优化',
    content: '请根据需求文档帮我优化测试覆盖率，补充必要的测试场景。',
  },
];
