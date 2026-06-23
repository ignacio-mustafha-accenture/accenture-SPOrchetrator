'use client';

import { createContext, useContext, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import { Topbar } from '@/shared/ui';

const PAGE_ORDER: Record<string, number> = {
  '/login': 0,
  '/forgot-password': 1,
  '/reset-password': 2,
};

// Shared direction so template.tsx can read the navigation direction at mount time.
// 0 = first load (fade only), 1 = forward, -1 = backward.
const NavigationDirectionContext = createContext<number>(0);

export function useNavigationDirection() {
  return useContext(NavigationDirectionContext);
}

/* eslint-disable react-hooks/refs */
export function AuthAnimatedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef<string>(pathname);
  const directionRef = useRef<number>(0);

  if (prevPathRef.current !== pathname) {
    const prev = PAGE_ORDER[prevPathRef.current] ?? 0;
    const next = PAGE_ORDER[pathname] ?? 0;
    directionRef.current = next >= prev ? 1 : -1;
    prevPathRef.current = pathname;
  }

  return (
    <NavigationDirectionContext.Provider value={directionRef.current}>
      <div className="min-h-screen bg-[var(--bg-base,#0a0c10)] overflow-hidden">
        <Topbar />
        {/*
          AnimatePresence lives here (layout, persiste entre navegaciones).
          El motion.div animado vive en template.tsx, que se remonta en cada
          navegación — eso garantiza que framer-motion vea un mount/unmount real
          y aplique initial ANTES de que el contenido sea visible.
        */}
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </div>
    </NavigationDirectionContext.Provider>
  );
}
/* eslint-enable react-hooks/refs */
