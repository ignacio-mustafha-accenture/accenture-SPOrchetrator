'use client';

import { useEffect } from 'react';

export default function HomeError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-sm`}>
        {error.message}
      </p>
      <button
        onClick={reset}
        className={String.raw`text-[color:var(--accent,#a100ff)] text-sm underline hover:opacity-80 transition-opacity`}
      >
        Reintentar
      </button>
    </div>
  );
}
