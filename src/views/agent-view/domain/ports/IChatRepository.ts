import type { ChatMessage } from '../entities/ChatMessage';
import type { ChatSession } from '../entities/ChatSession';

export interface IChatRepository {
  sendMessage(sessionId: string, content: string): Promise<ChatMessage>;
  getRecentSessions(): Promise<ChatSession[]>;
}
