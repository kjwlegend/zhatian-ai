import { chatWithOpenAI } from "./openai";

const API_BASE_URL = "https://your-backend-api-url.com";

export const sendMessage = async (
  message: string,
  topic: string,
  image?: File
) => {
  // 如果需要处理图片，您可能需要在这里添加额外的逻辑
  const response = await chatWithOpenAI(message, [], "", (partialResponse) => {
    console.log("Partial response:", partialResponse);
  });
  return { data: response };
};
