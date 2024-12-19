import axios from 'axios';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

const openaiClient = axios.create({
  baseURL: process.env.OPENAI_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

interface MessageContent {
  type?: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface Message {
  role: string;
  content: string | MessageContent[];
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(`data:${file.type};base64,${base64Data}`);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const chatWithOpenAI = async (
  message: string,
  history: Message[],
  componentDoc: string,
  systemPrompt: string,
  onPartialResponse: (content: string) => void,
  image?: string[]
) => {
  let messages: Message[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content:
        'Please use the following component documentation to help you answer the question: ' +
        componentDoc,
    },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];
  if (image) {
    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: message,
        },
        ...image.map((url) => ({
          type: 'image_url' as const,
          image_url: {
            url: url,
          },
        })),
      ],
    });
  } else {
    messages.push({
      role: 'user',
      content: message,
    });
  }

  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      image: !!image,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let fullContent = '';

  const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
    if (event.type === 'event') {
      const data = event.data;
      if (data === '[DONE]') {
        return;
      }
      try {
        const json = JSON.parse(data);
        const content = json.choices[0].delta.content;
        if (content) {
          fullContent += content;
          onPartialResponse(fullContent);
        }
      } catch (e) {
        console.error('Error parsing SSE message', e);
      }
    }
  });

  for await (const chunk of response.body as any) {
    const decoder = new TextDecoder();
    parser.feed(decoder.decode(chunk));
  }

  return fullContent;
};
