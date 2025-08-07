// import { AIAnalysisResult, UIElement, ComparisonResult } from '../types';
// import * as tf from '@tensorflow/tfjs';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';
// import { createWorker, ImageLike } from 'tesseract.js';

// export class AIAnalysisService {
//   private objectDetectionModel: cocoSsd.ObjectDetection | null = null;
//   private isInitialized = false;
//   private textWorker: Awaited<ReturnType<typeof createWorker>> | null = null;

//   constructor() {
//     this.initializeModels().catch(error => {
//       console.warn('Failed to initialize AI models:', error);
//     });
//   }

//   private async initializeModels() {
//     try {
//       // Initialize TensorFlow.js with WebGL backend
//       await tf.setBackend('webgl');
//       await tf.ready();

//       // Load COCO-SSD model
//       this.objectDetectionModel = await cocoSsd.load({
//         base: 'lite_mobilenet_v2'  // Use a lighter model for better performance
//       });

//       this.isInitialized = true;
//       console.log('AI models initialized successfully');

//       // Initialize Tesseract.js for text recognition
//       this.textWorker = await createWorker();
//       await this.textWorker.loadLanguage('eng');
//       await this.textWorker.initialize('eng');
//     } catch (error) {
//       console.error('Failed to initialize AI models:', error);
//       this.isInitialized = false;
//       throw error;
//     }
//   }

//   private async detectObjects(imageData: ImageData): Promise<cocoSsd.DetectedObject[]> {
//     if (!this.objectDetectionModel) {
//       throw new Error('Object detection model not initialized');
//     }

//     const tensor = tf.browser.fromPixels(imageData);
//     try {
//       const predictions = await this.objectDetectionModel.detect(tensor);
//       return predictions;
//     } finally {
//       tensor.dispose(); // Clean up tensor memory
//     }
//   }

//   private async extractText(imageData: ImageData): Promise<string[]> {
//     if (!this.textWorker) {
//       throw new Error('Text recognition worker not initialized');
//     }

//     const { data: { text } } = await this.textWorker.recognize(imageData);
//     return text.split('\n').filter(line => line.trim());
//   }

//   private async analyzeChanges(
//     baseObjects: cocoSsd.DetectedObject[],
//     compareObjects: cocoSsd.DetectedObject[]
//   ): Promise<UIElement[]> {
//     const changedElements: UIElement[] = [];

//     // Compare elements and detect changes
//     for (const baseObj of baseObjects) {
//       const matchingObj = compareObjects.find(obj =>
//         this.calculateElementOverlap(baseObj, obj) > 0.7
//       );

//       if (matchingObj) {
//         // Element modified
//         if (!this.areElementsSimilar(baseObj, matchingObj)) {
//           changedElements.push({
//             type: matchingObj.class,
//             bounds: {
//               x: matchingObj.bbox[0],
//               y: matchingObj.bbox[1],
//               width: matchingObj.bbox[2],
//               height: matchingObj.bbox[3]
//             },
//             confidence: matchingObj.score,
//             changes: [{
//               type: 'Modified',
//               severity: this.calculateChangeSeverity(baseObj, matchingObj),
//               description: this.generateChangeDescription(baseObj, matchingObj)
//             }]
//           });
//         }
//       } else {
//         // Element removed
//         changedElements.push({
//           type: baseObj.class,
//           bounds: {
//             x: baseObj.bbox[0],
//             y: baseObj.bbox[1],
//             width: baseObj.bbox[2],
//             height: baseObj.bbox[3]
//           },
//           confidence: baseObj.score,
//           changes: [{
//             type: 'Removed',
//             severity: 0.8,
//             description: `${baseObj.class} was removed`
//           }]
//         });
//       }
//     }

//     // Find added elements
//     for (const compareObj of compareObjects) {
//       const matchingObj = baseObjects.find(obj =>
//         this.calculateElementOverlap(compareObj, obj) > 0.7
//       );

//       if (!matchingObj) {
//         changedElements.push({
//           type: compareObj.class,
//           bounds: {
//             x: compareObj.bbox[0],
//             y: compareObj.bbox[1],
//             width: compareObj.bbox[2],
//             height: compareObj.bbox[3]
//           },
//           confidence: compareObj.score,
//           changes: [{
//             type: 'Added',
//             severity: 0.6,
//             description: `New ${compareObj.class} was added`
//           }]
//         });
//       }
//     }

//     return changedElements;
//   }

//   private calculateElementOverlap(obj1: cocoSsd.DetectedObject, obj2: cocoSsd.DetectedObject): number {
//     const xOverlap = Math.max(0,
//       Math.min(obj1.bbox[0] + obj1.bbox[2], obj2.bbox[0] + obj2.bbox[2]) -
//       Math.max(obj1.bbox[0], obj2.bbox[0])
//     );

//     const yOverlap = Math.max(0,
//       Math.min(obj1.bbox[1] + obj1.bbox[3], obj2.bbox[1] + obj2.bbox[3]) -
//       Math.max(obj1.bbox[1], obj2.bbox[1])
//     );

//     const overlapArea = xOverlap * yOverlap;
//     const area1 = obj1.bbox[2] * obj1.bbox[3];
//     const area2 = obj2.bbox[2] * obj2.bbox[3];

//     return overlapArea / Math.min(area1, area2);
//   }

//   private areElementsSimilar(obj1: cocoSsd.DetectedObject, obj2: cocoSsd.DetectedObject): boolean {
//     return obj1.class === obj2.class &&
//            this.calculateElementOverlap(obj1, obj2) > 0.9;
//   }

//   private calculateChangeSeverity(obj1: cocoSsd.DetectedObject, obj2: cocoSsd.DetectedObject): number {
//     const positionChange = Math.abs(
//       this.calculateElementOverlap(obj1, obj2) - 1
//     );
//     const typeChange = obj1.class !== obj2.class ? 1 : 0;

//     return Math.min((positionChange + typeChange) / 2, 1);
//   }

//   private generateChangeDescription(obj1: cocoSsd.DetectedObject, obj2: cocoSsd.DetectedObject): string {
//     const changes: string[] = [];

//     if (obj1.class !== obj2.class) {
//       changes.push(`Type changed from ${obj1.class} to ${obj2.class}`);
//     }

//     const positionChanged = !this.areElementsSimilar(obj1, obj2);
//     if (positionChanged) {
//       changes.push('Position or size was modified');
//     }

//     return changes.join(', ');
//   }

//   public async analyze(data: {
//     diffResult: ComparisonResult['diffResult'];
//     baseImage: string;
//     compareImage: string;
//     metadata: any;
//   }): Promise<AIAnalysisResult> {
//     if (!this.isInitialized) {
//       await this.initializeModels();
//     }

//     try {
//       const [baseImageData, compareImageData] = await Promise.all([
//         this.imageToImageData(data.baseImage),
//         this.imageToImageData(data.compareImage)
//       ]);

//       const [baseObjects, compareObjects] = await Promise.all([
//         this.detectObjects(baseImageData),
//         this.detectObjects(compareImageData)
//       ]);

//       // Analyze the differences
//       const addedObjects = compareObjects.filter(
//         compareObj => !baseObjects.some(
//           baseObj => baseObj.class === compareObj.class &&
//             Math.abs(baseObj.score - compareObj.score) < 0.2
//         )
//       );

//       const removedObjects = baseObjects.filter(
//         baseObj => !compareObjects.some(
//           compareObj => compareObj.class === baseObj.class &&
//             Math.abs(baseObj.score - compareObj.score) < 0.2
//         )
//       );

//       // Analyze changes between elements
//       const changedElements = await this.analyzeChanges(baseObjects, compareObjects);

//       // Extract text from both images for additional context
//       const [baseText, compareText] = await Promise.all([
//         this.extractText(baseImageData),
//         this.extractText(compareImageData)
//       ]);

//       // Generate analysis summary
//       const summary = this.generateSummary(
//         data.diffResult,
//         baseObjects,
//         compareObjects,
//         addedObjects,
//         removedObjects
//       );

//       // Generate recommendations
//       const recommendations = this.generateRecommendations(
//         data.diffResult,
//         addedObjects,
//         removedObjects
//       );

//       // Calculate overall confidence
//       const confidence = this.calculateOverallConfidence(changedElements);

//       return {
//         elements: changedElements,
//         summary,
//         recommendations,
//         confidence,
//         metadata: {
//           processingTime: Date.now() - data.metadata.processingTime,
//           baseTextContent: baseText,
//           compareTextContent: compareText
//         },
//         objectAnalysis: {
//           baseObjects,
//           compareObjects,
//           addedObjects,
//           removedObjects
//         }
//       };
//     } catch (error) {
//       console.error('AI analysis failed:', error);
//       return {
//         elements: [],
//         summary: 'AI analysis failed. Falling back to basic comparison.',
//         recommendations: ['Consider retrying the analysis if AI features are needed.'],
//         confidence: 0,
//         metadata: {
//           processingTime: 0,
//           baseTextContent: [],
//           compareTextContent: []
//         },
//         objectAnalysis: {
//           baseObjects: [],
//           compareObjects: [],
//           addedObjects: [],
//           removedObjects: []
//         }
//       };
//     }
//   }

//   private async imageToImageData(imageUrl: string): Promise<ImageData> {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = 'anonymous';

//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;

//         const ctx = canvas.getContext('2d');
//         if (!ctx) {
//           reject(new Error('Failed to get canvas context'));
//           return;
//         }

//         ctx.drawImage(img, 0, 0);
//         resolve(ctx.getImageData(0, 0, img.width, img.height));
//       };

//       img.onerror = () => reject(new Error('Failed to load image'));

//       // Use the proxy API route
//       const proxyUrl = `/api/image?url=${encodeURIComponent(imageUrl)}`;
//       img.src = proxyUrl;
//     });
//   }

//   private imageDataToImageLike(imageData: ImageData): ImageLike {
//     const canvas = document.createElement('canvas');
//     canvas.width = imageData.width;
//     canvas.height = imageData.height;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) throw new Error('Failed to get canvas context');

//     ctx.putImageData(imageData, 0, 0);

//     return {
//       width: imageData.width,
//       height: imageData.height,
//       src: canvas.toDataURL()
//     };
//   }

//   private generateSummary(
//     diffResult: ComparisonResult['diffResult'],
//     baseObjects: cocoSsd.DetectedObject[],
//     compareObjects: cocoSsd.DetectedObject[],
//     addedObjects: cocoSsd.DetectedObject[],
//     removedObjects: cocoSsd.DetectedObject[]
//   ): string {
//     const diffPercentage = diffResult.diffPercentage.toFixed(2);
//     const diffPixels = diffResult.diffPixels;

//     let summary = `Visual difference analysis: ${diffPercentage}% (${diffPixels} pixels) different. `;

//     if (addedObjects.length > 0 || removedObjects.length > 0) {
//       summary += `Detected ${addedObjects.length} new elements and ${removedObjects.length} removed elements. `;
//     }

//     if (baseObjects.length === compareObjects.length) {
//       summary += 'The overall structure appears to be maintained. ';
//     } else {
//       summary += 'There are significant structural changes. ';
//     }

//     return summary.trim();
//   }

//   private generateRecommendations(
//     diffResult: ComparisonResult['diffResult'],
//     addedObjects: cocoSsd.DetectedObject[],
//     removedObjects: cocoSsd.DetectedObject[]
//   ): string[] {
//     const recommendations: string[] = [];

//     if (diffResult.diffPercentage > 50) {
//       recommendations.push('Major changes detected. Consider reviewing the entire layout.');
//     }

//     if (addedObjects.length > 0) {
//       recommendations.push(`Review ${addedObjects.length} new elements for proper placement and styling.`);
//     }

//     if (removedObjects.length > 0) {
//       recommendations.push(`Verify if ${removedObjects.length} removed elements were intended to be removed.`);
//     }

//     if (recommendations.length === 0) {
//       recommendations.push('No significant issues detected. Changes appear to be minor.');
//     }

//     return recommendations;
//   }

//   private calculateOverallConfidence(elements: UIElement[]): number {
//     if (elements.length === 0) return 1;

//     const confidenceSum = elements.reduce(
//       (sum, el) => sum + el.confidence,
//       0
//     );

//     return confidenceSum / elements.length;
//   }

//   public cleanup() {
//     if (this.objectDetectionModel) {
//       // Clean up any resources
//       tf.dispose();
//     }
//     if (this.textWorker) {
//       this.textWorker.terminate();
//     }
//   }
// }
