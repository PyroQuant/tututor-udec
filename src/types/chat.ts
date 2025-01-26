export interface ChatResponse {
  id: string;
  type: string;
  close: boolean;
  error: string | null;
  chatId: number;
  textResponse: string;
  sources: any[];
}

export interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatHistory {
  id: number;
  title: string;
  preview: string;
  timestamp: Date;
}
