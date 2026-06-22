'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useNavigationDirection } from '@/views/auth/layout/AuthAnimatedShell';

const transition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 36,
  mass: 0.8,
};

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const direction = useNavigationDirection();

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        x: direction > 0 ? '6%' : direction < 0 ? '-6%' : 0,
      }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: direction >= 0 ? '-6%' : '6%',
      }}
      transition={transition}
      className="flex items-center justify-center min-h-[calc(100vh-44px)] px-4 py-10"
    >
      {children}
    </motion.div>
  );
}
