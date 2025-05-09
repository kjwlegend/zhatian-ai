declare module 'tesseract.js' {
  export interface Worker {
    loadLanguage(lang: string): Promise<void>;
    initialize(lang: string): Promise<void>;
    terminate(): Promise<void>;
    recognize(image: ImageLike): Promise<RecognizeResult>;
  }

  export interface ImageLike {
    width: number;
    height: number;
    data?: Uint8Array | Uint8ClampedArray;
    src?: string;
  }

  export interface RecognizeResult {
    data: {
      text: string;
      lines: Array<{
        text: string;
        confidence: number;
      }>;
    };
  }

  export function createWorker(options?: {
    logger?: (args: { status: string; progress: number }) => void;
  }): Promise<Worker>;
}
