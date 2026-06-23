import type { ChatMessage } from '../../domain/entities/ChatMessage';
import type { ChatSession } from '../../domain/entities/ChatSession';
import type { CreateSessionResult, IChatRepository, SendMessageResult } from '../../domain/ports/IChatRepository';

export class BEApiChatRepository implements IChatRepository {
  private readonly base = process.env.API_URL ?? 'http://localhost:3001/api/v1';

  constructor(private readonly token: string) {}

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API ${res.status} POST ${path}`);
    return res.json() as Promise<T>;
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      headers: { ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}) },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API ${res.status} GET ${path}`);
    return res.json() as Promise<T>;
  }

  async createSession(lang?: string): Promise<CreateSessionResult> {
    const data = await this.post<{ sessionId: string; welcomeMessage: RawMessage }>(
      '/agent/sessions',
      { lang: lang ?? 'es' },
    );
    return {
      sessionId: data.sessionId,
      welcomeMessage: toMessage(data.welcomeMessage),
    };
  }

  async sendMessage(sessionId: string, content: string, lang?: string): Promise<SendMessageResult> {
    const data = await this.post<RawSendMessageResponse>(
      `/agent/sessions/${sessionId}/messages`,
      { content, lang: lang ?? 'es' },
    );
    return {
      message: toMessage(data.message),
      logEntries: data.logEntries?.map((e) => ({
        id: e.id,
        type: e.type,
        label: e.label,
        detail: e.detail,
        timestamp: new Date(e.timestamp),
      })),
    };
  }

  async getRecentSessions(): Promise<ChatSession[]> {
    return this.get<ChatSession[]>('/agent/sessions');
  }
}

// ── Raw API shapes (timestamps arrive as strings) ─────────────────────────────

interface RawMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

interface RawLogEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  label: string;
  detail?: string;
  timestamp: string;
}

interface RawSendMessageResponse {
  message: RawMessage;
  logEntries?: RawLogEntry[];
}

function toMessage(raw: RawMessage): ChatMessage {
  return {
    id: raw.id,
    role: raw.role,
    content: raw.content,
    timestamp: new Date(raw.timestamp),
  };
}
