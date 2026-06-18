export type SessionStatus = 'open' | 'closed' | 'draft';

export type ChatSession = {
  id: string;
  title: string;
  category: string;
  status: SessionStatus;
  date: string;
};
