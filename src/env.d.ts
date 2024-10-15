/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_OPENAI_API_URL: string;
  // 在这里添加其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
