export type LogEntryData = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  label: string;
  detail?: string;
  timestamp: Date;
};
