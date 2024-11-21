import axios from 'axios';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

const openaiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_OPENAI_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
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
  image?: File
) => {
  let messages: Message[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: 'Please use the following component documentation to help you answer the question: ' + componentDoc,
    },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  // Handle the latest message with potential image
  if (image) {
    const base64Image = await convertImageToBase64(image);
    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: message,
        },
        {
          type: 'image_url',
          image_url: {
            url: base64Image,
          },
        },
      ],
    });
  } else {
    messages.push({
      role: 'user',
      content: message,
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: image ? 'gpt-4o' : 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 0,
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
