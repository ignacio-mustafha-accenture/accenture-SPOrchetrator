'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { SuggestionChip } from '@/shared/ui';
import { createSession } from '../actions/createSession';
import { sendMessage } from '../actions/sendMessage';
import type { LogEntryData } from '../domain/entities/AgentLogEntry';
import type { ChatMessage } from '../domain/entities/ChatMessage';
import { AgentChatShell } from '../components/AgentChatShell/AgentChatShell';
import { ChatInputArea } from '../components/ChatArea/ChatInputArea';
import { ChatThread } from '../components/ChatArea/ChatThread';

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "circOut", delay },
  }),
};

const chipsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.28 } },
};

const chipItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "circOut" } },
};

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "circOut", delay: 0.12 },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

type AgentViewPageProps = {
  userName?: string;
};

export function AgentViewPage({ userName = 'Ignacio' }: AgentViewPageProps) {
  const t = useTranslations('agentView');
  const locale = useLocale();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntryData[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('greetingMorning', { name: userName }) :
    hour < 18 ? t('greetingAfternoon', { name: userName }) :
    t('greetingEvening', { name: userName });

  const suggestions = [
    t('suggestions.createRfp'),
    t('suggestions.reviewSubmissions'),
    t('suggestions.checkSuppliers'),
    t('suggestions.scheduleMeeting'),
  ];

  const handleSubmit = (content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    startTransition(async () => {
      let sid = sessionId;
      if (!sid) {
        const created = await createSession(locale);
        sid = created.sessionId;
        setSessionId(sid);
        setMessages((prev) => [...prev, created.welcomeMessage]);
      }
      const result = await sendMessage(sid, content, locale);
      setMessages((prev) => [...prev, result.message]);
      if (result.logEntries?.length) {
        setLogEntries((prev) => [...prev, ...result.logEntries!]);
      }
    });
  };

  const hasMessages = messages.length > 0;

  return (
    <AgentChatShell logEntries={logEntries}>
      <div className="flex flex-col h-full">

        {/* ── Landing / greeting ── */}
        {!hasMessages && (
          <div className="flex flex-1 flex-col gap-3 items-center justify-center min-h-0 overflow-clip pb-10 pt-14 px-6 xl:px-20 w-full">

            {/* Heading — fade up first */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="font-extrabold text-[var(--text-primary)] text-[22px] md:text-[28px] xl:text-[32px] text-center whitespace-nowrap"
            >
              {greeting}
            </motion.h1>

            {/* Subtitle — fade up slightly later */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="font-normal leading-relaxed text-[var(--text-secondary)] text-[13px] md:text-[14px] xl:text-[16px] text-center"
            >
              {t('subtitle')}
            </motion.p>

            {/* Chips — staggered one by one */}
            <motion.div
              variants={chipsContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-1.5 md:gap-2 items-start justify-center mt-1"
            >
              {suggestions.map((suggestion) => (
                <motion.div key={suggestion} variants={chipItem}>
                  <SuggestionChip
                    action={async (formData: FormData) => {
                      const msg = formData.get('message') as string;
                      if (msg) handleSubmit(msg);
                    }}
                    message={suggestion}
                  >
                    {suggestion}
                  </SuggestionChip>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* ── Active chat thread ── */}
        {hasMessages && <ChatThread messages={messages} isPending={isPending} />}

        {/* ── Input bar — fades in from above ── */}
        <motion.div
          variants={fadeDown}
          initial="hidden"
          animate="visible"
        >
          <ChatInputArea onSubmit={handleSubmit} isPending={isPending} />
        </motion.div>

      </div>
    </AgentChatShell>
  );
}
