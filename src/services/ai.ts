import type { ChatResponse } from '@/types/chat';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
  try {
    console.log('Enviando mensaje a:', API_URL);
    console.log('Datos:', { message, sessionId });
    
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
      const errorText = await response.text();
      console.error('Error en la respuesta:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Error en la comunicación con la IA: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta recibida:', data);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error detallado:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('Error desconocido:', error);
    }
    throw new Error('Error en la comunicación con la IA');
  }
}
