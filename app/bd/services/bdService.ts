import { chatWithOpenAI } from '@/app/services/openai';
import { BrandBasicInfo, BrandNews, HistoricalProject, Message } from '../store/useBdStore';
import {
  BRAND_BASIC_INFO_PROMPT,
  CONVERSATION_PROMPT,
  SPEECH_PROMPT_CHINESE,
  SPEECH_PROMPT_ENGLISH,
  STRUCTURE_PROMPT,
} from '../utils/prompts';

// 添加类型定义
export interface BidRequirementsType {
  background: string;
  scope: string;
  direction: string;
}

export const bdService = {
  // 获取品牌基础信息
  async getBrandBasicInfo(brandName: string): Promise<BrandBasicInfo> {
    try {
      const response = await chatWithOpenAI(
        brandName,
        [],
        '',
        BRAND_BASIC_INFO_PROMPT,
        () => {},
        undefined
      );

      const basicInfo = JSON.parse(response) as BrandBasicInfo;
      return {
        name: basicInfo.name || brandName,
        background: basicInfo.background || `无法获取${brandName}的背景信息`,
        competitors: basicInfo.competitors || [],
      };
    } catch (error) {
      console.error('获取品牌基础信息失败:', error);
      return {
        name: brandName,
        background: '抱歉，获取品牌信息时发生错误',
        competitors: [],
      };
    }
  },

  // 获取品牌新闻
  async getBrandNews(brandName: string): Promise<BrandNews[] | null> {
    // TODO: 实现真实的新闻获取逻辑
    return null;
  },

  // 获取历史项目
  async getBrandProjects(brandName: string): Promise<HistoricalProject[] | null> {
    // TODO: 实现从数据库获取项目信息的逻辑
    return null;
  },

  // 发送消息获取回复
  async sendMessage(
    message: string,
    history: Message[],
    brandInfo?: BrandBasicInfo | null,
    bidRequirements?: BidRequirementsType | null,
    onPartialResponse?: (content: string) => void
  ): Promise<Message> {
    try {
      // 构建上下文信息
      let contextInfo = '';
      if (brandInfo) {
        contextInfo += `
品牌信息:
- 名称: ${brandInfo.name}
- 背景: ${brandInfo.background}
- 主要竞争对手: ${brandInfo.competitors.map((c) => c.name).join(', ')}
`;
      }

      if (bidRequirements) {
        contextInfo += `
投标需求:
- 背景: ${bidRequirements.background}
- 范围: ${bidRequirements.scope}
- 方向: ${bidRequirements.direction}
`;
      }

      // 调用 OpenAI API
      const response = await chatWithOpenAI(
        message,
        history,
        contextInfo,
        CONVERSATION_PROMPT,
        onPartialResponse || (() => {}),
        undefined
      );

      // 解析引用资料
      const references = [
        {
          title: '相关行业报告',
          link: '#',
          type: 'file' as const,
          fileType: 'PDF' as const,
        },
        // 可以根据回复内容动态生成更多引用
      ];

      return {
        role: 'assistant',
        content: response,
        references,
      };
    } catch (error) {
      console.error('发送消息失败:', error);
      return {
        role: 'assistant',
        content: '抱歉，处理您的消息时发生错误。请稍后重试。',
      };
    }
  },

  // 生成方案结构
  async generateStructure(
    conversation: Message[],
    brandInfo?: BrandBasicInfo | null,
    bidRequirements?: BidRequirementsType | null,
    onPartialResponse?: (content: string) => void
  ): Promise<string> {
    try {
      // 构建上下文信息
      let contextInfo = '';
      if (brandInfo) {
        contextInfo += `
品牌信息:
- 名称: ${brandInfo.name}
- 背景: ${brandInfo.background}
- 主要竞争对手: ${brandInfo.competitors.map((c) => c.name).join(', ')}
`;
      }

      if (bidRequirements) {
        contextInfo += `
投标需求:
- 背景: ${bidRequirements.background}
- 范围: ${bidRequirements.scope}
- 方向: ${bidRequirements.direction}
`;
      }

      // 添加对话历史作为上下文
      contextInfo +=
        '\n对话历史:\n' +
        conversation
          .map((msg) => `${msg.role === 'user' ? '问' : '答'}: ${msg.content}`)
          .join('\n');

      // 调用 OpenAI API
      const response = await chatWithOpenAI(
        '请根据以上信息生成投标方案结构',
        [],
        contextInfo,
        STRUCTURE_PROMPT,
        onPartialResponse || (() => {}),
        undefined
      );

      return response;
    } catch (error) {
      console.error('生成方案结构失败:', error);
      throw error;
    }
  },

  // 生成中文演讲稿
  async generateChineseSpeech(
    conversation: Message[],
    brandInfo?: BrandBasicInfo | null,
    bidRequirements?: BidRequirementsType | null,
    structure?: string,
    onPartialResponse?: (content: string) => void
  ): Promise<string> {
    try {
      // 构建上下文信息
      let contextInfo = this.buildContextInfo(conversation, brandInfo, bidRequirements, structure);

      // 调用 OpenAI API
      const response = await chatWithOpenAI(
        '请根据以上信息生成中文演讲稿',
        [],
        contextInfo,
        SPEECH_PROMPT_CHINESE,
        onPartialResponse || (() => {}),
        undefined
      );

      return response;
    } catch (error) {
      console.error('生成中文演讲稿失败:', error);
      return '生成演讲稿时发生错误，请稍后重试。';
    }
  },

  // 生成英文演讲稿
  async generateEnglishSpeech(
    conversation: Message[],
    brandInfo?: BrandBasicInfo | null,
    bidRequirements?: BidRequirementsType | null,
    structure?: string,
    onPartialResponse?: (content: string) => void
  ): Promise<string> {
    try {
      // 构建上下文信息
      let contextInfo = this.buildContextInfo(conversation, brandInfo, bidRequirements, structure);

      // 调用 OpenAI API
      const response = await chatWithOpenAI(
        'Please generate an English speech based on the above information',
        [],
        contextInfo,
        SPEECH_PROMPT_ENGLISH,
        onPartialResponse || (() => {}),
        undefined
      );

      return response;
    } catch (error) {
      console.error('生成英文演讲稿失败:', error);
      return 'An error occurred while generating the speech. Please try again later.';
    }
  },

  // 辅助方法：构建上下文信息
  buildContextInfo(
    conversation: Message[],
    brandInfo?: BrandBasicInfo | null,
    bidRequirements?: BidRequirementsType | null,
    structure?: string
  ): string {
    let contextInfo = '';
    if (brandInfo) {
      contextInfo += `
品牌信息:
- 名称: ${brandInfo.name}
- 背景: ${brandInfo.background}
- 主要竞争对手: ${brandInfo.competitors.map((c) => c.name).join(', ')}
`;
    }

    if (bidRequirements) {
      contextInfo += `
投标需求:
- 背景: ${bidRequirements.background}
- 范围: ${bidRequirements.scope}
- 方向: ${bidRequirements.direction}
`;
    }

    if (structure) {
      contextInfo += `\n方案结构:\n${structure}`;
    }

    contextInfo +=
      '\n对话历史:\n' +
      conversation.map((msg) => `${msg.role === 'user' ? '问' : '答'}: ${msg.content}`).join('\n');

    return contextInfo;
  },
};
