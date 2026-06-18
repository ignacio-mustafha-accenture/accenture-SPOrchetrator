import React from 'react';
import clsx from 'clsx';

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function Link({ href, children, className, target, rel }: LinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={clsx(
        String.raw`font-medium leading-normal text-[color:var(--accent,#a100ff)] text-[length:var(--font\/size\/md,13px)] whitespace-nowrap`,
        'hover:underline decoration-solid [text-underline-position:from-font]',
        className,
      )}
    >
      {children}
    </a>
  );
}
