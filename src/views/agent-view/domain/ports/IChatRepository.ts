import type { LogEntryData } from '../entities/AgentLogEntry';
import type { ChatMessage } from '../entities/ChatMessage';
import type { ChatSession } from '../entities/ChatSession';

export type SendMessageResult = {
  message: ChatMessage;
  logEntries?: LogEntryData[];
};

export type CreateSessionResult = {
  sessionId: string;
  welcomeMessage: ChatMessage;
};

export interface IChatRepository {
  createSession(lang?: string): Promise<CreateSessionResult>;
  sendMessage(sessionId: string, content: string, lang?: string): Promise<SendMessageResult>;
  getRecentSessions(): Promise<ChatSession[]>;
}
