import type { ChatResponse } from '@/types/chat';

const API_URL = 'https://saez2.sebagarcia.dev/api/v1/workspace/saez/chat';
const API_KEY = 'C407VKW-JT14A4X-MMK43ZW-67AR3CN';

export async function sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        mode: 'chat',
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la comunicación con la IA');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
}