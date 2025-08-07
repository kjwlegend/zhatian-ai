'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FRAMEWORK_OPTIONS } from '@/app/codes/components/FrameworkSelector';

type CodeType = 'frontend' | 'backend' | 'test';

interface CodeState {
  // Framework selection state
  selectedFrameworks: Record<CodeType, string>;
  setSelectedFramework: (type: CodeType, framework: string) => void;

  // Code output state
  codeOutputs: Record<CodeType, Record<string, string>>;
  setCodeOutput: (type: CodeType, code: Record<string, string>) => void;
  updateCodeOutput: (type: CodeType, newCode: Record<string, string>) => void;
  clearCodeOutput: (type: CodeType) => void;
  clearAllCodeOutputs: () => void;

  // Active tab state
  activeTabs: Record<CodeType, string>;
  setActiveTab: (type: CodeType, tab: string) => void;

  // Component Doc state
  componentDoc: string;
  setComponentDoc: (doc: string) => void;

  // Design File state
  designFile: string | null;
  setDesignFile: (file: string | null) => void;

  // Test Case state
  testCases: string;
  setTestCases: (cases: string) => void;
  clearTestCases: () => void;

  // CMS state
  cmsCode: Record<string, string>;
  setCmsCode: (code: Record<string, string>) => void;
  updateCmsCode: (code: Record<string, string>) => void;
  clearCmsCode: () => void;

  // JIRA state
  jiraContent: string;
  setJiraContent: (content: string) => void;
}

const getInitialFramework = (type: CodeType) => {
  return FRAMEWORK_OPTIONS[type][0].value;
};

const getInitialTab = (type: CodeType) => {
  const framework = getInitialFramework(type);
  const frameworkConfig = FRAMEWORK_OPTIONS[type].find((f) => f.value === framework);
  return frameworkConfig?.tabs[0] || '';
};

export const useCodeStore = create<CodeState>()(
  persist(
    (set) => ({
      // Initialize with default frameworks for each type
      selectedFrameworks: {
        frontend: getInitialFramework('frontend'),
        backend: getInitialFramework('backend'),
        test: getInitialFramework('test'),
      },

      // Initialize empty code outputs for each type
      codeOutputs: {
        frontend: {},
        backend: {},
        test: {},
      },

      // Initialize with default active tabs
      activeTabs: {
        frontend: getInitialTab('frontend'),
        backend: getInitialTab('backend'),
        test: getInitialTab('test'),
      },

      // Initialize component doc and design file
      componentDoc: '',
      designFile: null,
      testCases: '',

      // Initialize CMS code
      cmsCode: {},

      // JIRA state
      jiraContent: '',

      setSelectedFramework: (type, framework) =>
        set((state) => ({
          selectedFrameworks: {
            ...state.selectedFrameworks,
            [type]: framework,
          },
          activeTabs: {
            ...state.activeTabs,
            [type]:
              FRAMEWORK_OPTIONS[type].find((f) => f.value === framework)?.tabs[0] ||
              state.activeTabs[type],
          },
        })),

      setCodeOutput: (type, code) =>
        set((state) => ({
          codeOutputs: {
            ...state.codeOutputs,
            [type]: code,
          },
        })),

      updateCodeOutput: (type, newCode) =>
        set((state) => ({
          codeOutputs: {
            ...state.codeOutputs,
            [type]: {
              ...state.codeOutputs[type],
              ...newCode,
            },
          },
        })),

      clearCodeOutput: (type) =>
        set((state) => ({
          codeOutputs: {
            ...state.codeOutputs,
            [type]: {},
          },
        })),

      clearAllCodeOutputs: () =>
        set({
          codeOutputs: {
            frontend: {},
            backend: {},
            test: {},
          },
          designFile: null,
          componentDoc: '',
          cmsCode: {},
        }),

      setActiveTab: (type, tab) =>
        set((state) => ({
          activeTabs: {
            ...state.activeTabs,
            [type]: tab,
          },
        })),

      setTestCases: (testCases: string) => set({ testCases: testCases }),
      clearTestCases: () => set({ testCases: '' }),

      setComponentDoc: (doc) => set({ componentDoc: doc }),
      setDesignFile: (file) => set({ designFile: file }),
      setCmsCode: (code) => set({ cmsCode: code }),
      updateCmsCode: (code) => set({ cmsCode: code }),
      clearCmsCode: () => set({ cmsCode: {} }),

      setJiraContent: (content) => set({ jiraContent: content }),
    }),
    {
      name: 'code-storage',
    }
  )
);

// Helper hooks for specific code types
export const useFrontendCode = () => {
  const store = useCodeStore();
  return {
    selectedFramework: store.selectedFrameworks.frontend,
    setSelectedFramework: (framework: string) => store.setSelectedFramework('frontend', framework),
    codeOutput: store.codeOutputs.frontend,
    updateCodeOutput: (code: Record<string, string>) => store.updateCodeOutput('frontend', code),
    clearCodeOutput: () => store.clearCodeOutput('frontend'),
    activeTab: store.activeTabs.frontend,
    setActiveTab: (tab: string) => store.setActiveTab('frontend', tab),
  };
};

export const useBackendCode = () => {
  const store = useCodeStore();
  return {
    selectedFramework: store.selectedFrameworks.backend,
    setSelectedFramework: (framework: string) => store.setSelectedFramework('backend', framework),
    codeOutput: store.codeOutputs.backend,
    updateCodeOutput: (code: Record<string, string>) => store.updateCodeOutput('backend', code),
    clearCodeOutput: () => store.clearCodeOutput('backend'),
    activeTab: store.activeTabs.backend,
    setActiveTab: (tab: string) => store.setActiveTab('backend', tab),
  };
};

export const useTestCode = () => {
  const store = useCodeStore();
  return {
    selectedFramework: store.selectedFrameworks.test,
    setSelectedFramework: (framework: string) => store.setSelectedFramework('test', framework),
    codeOutput: store.codeOutputs.test,
    updateCodeOutput: (code: Record<string, string>) => store.updateCodeOutput('test', code),
    clearCodeOutput: () => store.clearCodeOutput('test'),
    activeTab: store.activeTabs.test,
    setActiveTab: (tab: string) => store.setActiveTab('test', tab),
  };
};

export const useCmsCode = create<{
  codeOutput: Record<string, string>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateCodeOutput: (code: Record<string, string>) => void;
  clearCodeOutput: () => void;
}>((set) => ({
  codeOutput: {},
  activeTab: 'gutenberg',
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateCodeOutput: (code) => set({ codeOutput: code }),
  clearCodeOutput: () => set({ codeOutput: {} }),
}));
