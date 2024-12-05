import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Brand {
  id: number;
  value: string;
  label: string;
}

export interface BidRequirements {
  background: string;
  scope: string;
  direction: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  references?: Array<{
    title: string;
    link: string;
    type: 'file' | 'link';
    fileType?: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX';
  }>;
}

export interface BrandBasicInfo {
  name: string;
  background: string;
  competitors: Array<{
    name: string;
    strengths: string;
    categories: string[];
    type: string;
  }>;
}

export interface BrandNews {
  id: number;
  title: string;
  date: string;
  url: string;
  icon: string;
}

export interface HistoricalProject {
  id: number;
  name: string;
  date: string;
  result: string;
}

interface BdState {
  // 品牌相关状态
  selectedBrand: string;
  customBrand: string;
  brandList: Brand[];

  // 对话相关状态
  conversation: Message[];
  userMessage: string;

  // 演讲稿状态
  speech: {
    chinese: string;
    english: string;
  };
  isGeneratingSpeech: boolean;
  partialSpeech: {
    chinese: string;
    english: string;
  };

  // 投标需求状态
  bidRequirements: BidRequirements;

  // Tab 状态
  currentTab: string;

  // 品牌信息相关状态
  brandBasicInfo: BrandBasicInfo | null;
  brandNews: BrandNews[] | null;
  historicalProjects: HistoricalProject[] | null;

  isLoadingBasicInfo: boolean;
  isLoadingNews: boolean;
  isLoadingProjects: boolean;

  // 方案结构状态
  structure: string;
  isGeneratingStructure: boolean;
  partialStructure: string;

  // Actions
  setSelectedBrand: (brand: string) => void;
  setCustomBrand: (brand: string) => void;
  addMessage: (message: Message) => void;
  setUserMessage: (message: string) => void;
  setSpeech: (speech: { chinese: string; english: string }) => void;
  setBidRequirements: (requirements: BidRequirements) => void;
  setCurrentTab: (tab: string) => void;
  setBrandBasicInfo: (info: BrandBasicInfo | null) => void;
  setBrandNews: (news: BrandNews[] | null) => void;
  setHistoricalProjects: (projects: HistoricalProject[] | null) => void;
  setIsLoadingBasicInfo: (loading: boolean) => void;
  setIsLoadingNews: (loading: boolean) => void;
  setIsLoadingProjects: (loading: boolean) => void;
  setConversation: (messages: Message[]) => void;
  setStructure: (structure: string) => void;
  setIsGeneratingStructure: (isGenerating: boolean) => void;
  setPartialStructure: (partial: string) => void;
  setIsGeneratingSpeech: (isGenerating: boolean) => void;
  setPartialSpeech: (partial: { chinese: string; english: string }) => void;
}

export const useBdStore = create<BdState>()(
  devtools((set) => ({
    // 初始状态
    selectedBrand: '',
    customBrand: '',
    brandList: [
      { id: 1, value: 'apple', label: '苹果' },
      { id: 2, value: 'samsung', label: '三星' },
      { id: 3, value: 'huawei', label: '华为' },
      { id: 4, value: 'xiaomi', label: '小米' },
      { id: 5, value: 'oppo', label: 'OPPO' },
    ],
    conversation: [],
    userMessage: '',
    speech: {
      chinese: '',
      english: '',
    },
    isGeneratingSpeech: false,
    partialSpeech: {
      chinese: '',
      english: '',
    },
    bidRequirements: {
      background: '',
      scope: '',
      direction: '',
    },
    currentTab: 'requirements',
    brandBasicInfo: null,
    brandNews: null,
    historicalProjects: null,
    isLoadingBasicInfo: false,
    isLoadingNews: false,
    isLoadingProjects: false,
    structure: '',
    isGeneratingStructure: false,
    partialStructure: '',

    // Actions
    setSelectedBrand: (brand) => set({ selectedBrand: brand }),
    setCustomBrand: (brand) => set({ customBrand: brand }),
    addMessage: (message) =>
      set((state) => ({
        conversation: [...state.conversation, message],
      })),
    setUserMessage: (message) => set({ userMessage: message }),
    setSpeech: (speech) => set({ speech }),
    setBidRequirements: (requirements) => set({ bidRequirements: requirements }),
    setCurrentTab: (tab) => set({ currentTab: tab }),
    setBrandBasicInfo: (info) => set({ brandBasicInfo: info }),
    setBrandNews: (news) => set({ brandNews: news }),
    setHistoricalProjects: (projects) => set({ historicalProjects: projects }),
    setIsLoadingBasicInfo: (loading) => set({ isLoadingBasicInfo: loading }),
    setIsLoadingNews: (loading) => set({ isLoadingNews: loading }),
    setIsLoadingProjects: (loading) => set({ isLoadingProjects: loading }),
    setConversation: (messages) => set({ conversation: messages }),
    setStructure: (structure) => set({ structure }),
    setIsGeneratingStructure: (isGenerating) => set({ isGeneratingStructure: isGenerating }),
    setPartialStructure: (partial) => set({ partialStructure: partial }),
    setIsGeneratingSpeech: (isGenerating) => set({ isGeneratingSpeech: isGenerating }),
    setPartialSpeech: (partial) => set({ partialSpeech: partial }),
  }))
);
