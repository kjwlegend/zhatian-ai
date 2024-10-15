import axios from "axios";
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser";

const openaiClient = axios.create({
  baseURL: import.meta.env.VITE_OPENAI_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

interface ParsedResponse {
  text: string;
  code: {
    html: string;
    index: string;
    panel: string;
    scss: string;
  };
}

function parseResponse(content: string): ParsedResponse {
  const codeBlocks = {
    html: "",
    index: "",
    panel: "",
    scss: "",
  };

  const text = content
    .replace(/```(html|index|panel|scss)\n([\s\S]*?)```/g, (_, type, code) => {
      codeBlocks[type as keyof typeof codeBlocks] = code.trim();
      return "";
    })
    .trim();

  return { text, code: codeBlocks };
}

export const chatWithOpenAI = async (
  message: string,
  history: { role: string; content: string }[],
  systemPrompt: string,
  onPartialResponse: (partialResponse: ParsedResponse) => void
) => {
  const response = await fetch(
    `${import.meta.env.VITE_OPENAI_API_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. When providing code examples, please wrap them in triple backticks and use the following format: ```html for html code, ```index for index code, ```panel for panel.js code, and ```scss for SCSS code.",
          },
          ...history,
          { role: "user", content: message },
        ],
        stream: true,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let fullContent = "";

  const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
    if (event.type === "event") {
      const data = event.data;
      if (data === "[DONE]") {
        return;
      }
      try {
        const json = JSON.parse(data);
        const content = json.choices[0].delta.content;
        if (content) {
          fullContent += content;
          const parsedContent = parseResponse(fullContent);
          onPartialResponse(parsedContent);
        }
      } catch (e) {
        console.error("Error parsing SSE message", e);
      }
    }
  });

  for await (const chunk of response.body as any) {
    const decoder = new TextDecoder();
    parser.feed(decoder.decode(chunk));
  }

  return parseResponse(fullContent);
};
