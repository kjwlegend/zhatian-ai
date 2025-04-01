// Type declarations for external modules

declare module 'pngjs' {
  export class PNG {
    constructor(options?: { width?: number; height?: number });
    width: number;
    height: number;
    data: Buffer;
    pack(): PNG;
    pipe(destination: any): any;
    on(event: string, callback: Function): void;
  }
}

declare module 'pixelmatch' {
  function pixelmatch(
    img1: Buffer | Uint8Array | Uint8ClampedArray,
    img2: Buffer | Uint8Array | Uint8ClampedArray,
    output: Buffer | Uint8Array | Uint8ClampedArray,
    width: number,
    height: number,
    options?: {
      threshold?: number;
      includeAA?: boolean;
      alpha?: number;
      aaColor?: [number, number, number];
      diffColor?: [number, number, number];
      diffMask?: boolean;
    }
  ): number;

  export default pixelmatch;
}
