import type { LogEntryData } from '../../domain/entities/AgentLogEntry';
import type { ChatMessage } from '../../domain/entities/ChatMessage';
import type { ChatSession } from '../../domain/entities/ChatSession';
import type { CreateSessionResult, IChatRepository, SendMessageResult } from '../../domain/ports/IChatRepository';

const MOCK_SESSIONS: ChatSession[] = [
  { id: 'rfp-2026-048', title: 'RFP-2026-048 · Logistics', category: 'Logistics', status: 'closed', date: 'Jun 10' },
  { id: 'rfp-2026-031', title: 'RFP-2026-031 · Cleaning', category: 'Facilities', status: 'open', date: 'Jun 5' },
  { id: 'rfp-2026-017', title: 'RFP-2026-017 · IT Services', category: 'Technology', status: 'closed', date: 'May 28' },
];

const MOCK_RESPONSES: string[] = [
  "I've started drafting the RFP based on your specifications. I'll need a few more details to complete the scope of work.",
  "I can help you review those submissions. I found 4 open RFPs with pending supplier responses.",
  "Here's the supplier performance summary for the last quarter. Three suppliers are flagged for delivery delays.",
  "I've scheduled the evaluation meeting for next Tuesday at 10 AM. Invitations have been sent to all stakeholders.",
];

export class MockChatRepository implements IChatRepository {
  async createSession(_lang?: string): Promise<CreateSessionResult> {
    await new Promise((r) => setTimeout(r, 100));
    return {
      sessionId: `mock-${Date.now()}`,
      welcomeMessage: {
        id: `msg-${Date.now()}`,
        role: 'agent',
        content: '¡Hola! Soy **IQ**, tu asistente de procurement. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    };
  }

  async sendMessage(_sessionId: string, _content: string): Promise<SendMessageResult> {
    await new Promise((r) => setTimeout(r, 800));
    const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'agent',
      content: response,
      timestamp: new Date(),
    };
    const logEntries: LogEntryData[] = [
      { id: `log-${Date.now()}`, type: 'info', label: 'Processing request', detail: 'Analyzing query...', timestamp: new Date() },
      { id: `log-${Date.now() + 1}`, type: 'success', label: 'Response generated', timestamp: new Date() },
    ];
    return { message, logEntries };
  }

  async getRecentSessions(): Promise<ChatSession[]> {
    await new Promise((r) => setTimeout(r, 50));
    return MOCK_SESSIONS;
  }
}
