import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

interface Message {
  role: string;
  content: string;
}

interface FileUpload {
  type: 'image';
  transfer_method: 'remote_url' | 'local_file';
  url?: string;
  upload_file_id?: string;
}



export const chatWithDify = async (
  message: string,
  inputs: any,
  onPartialResponse: (content: string) => void,
  onResponseEnd?: (content: string, conversationId: string) => void,
  conversationId?: string,
  image?: string
) => {
  let files: FileUpload[] = [];
  
  if (image) {
    files.push({
      type: 'image',
      transfer_method: 'remote_url',
      url: image
    });
  }

  try {
    const response = await fetch('/api/dify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: inputs,
        query: message,
        response_mode: 'streaming',
        conversation_id: conversationId,
        user: 'default_user',
        files: files.length > 0 ? files : undefined,
      }),
    });
    


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }


    let fullContent = '';

    const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const data = event.data;
        if (data === '[DONE]') {
          return;
        }
        try {
          if (data) {
            const json = JSON.parse(data);
            if (json.answer) {
              fullContent += json.answer;
              onPartialResponse(fullContent);
            }
            if(json.event === 'message_end') {
                const conversationId = json.conversation_id;
                onResponseEnd?.(fullContent, conversationId);
            }
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
  } catch (error) {
    console.error('Error in chatWithDify:', error);
    throw error;
  }
};
