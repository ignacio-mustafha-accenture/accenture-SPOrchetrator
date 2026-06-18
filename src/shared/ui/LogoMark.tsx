type LogoMarkProps = {
  className?: string;
  text?: string;
};

export function LogoMark({ className, text = 'IQ' }: LogoMarkProps) {
  return (
    <div
      className={
        className ||
        String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-[var(--radius-logo,8px)] size-[40px]`
      }
    >
      <p className={String.raw`font-bold leading-normal text-[color:var(--text\/on-accent,white)] text-[length:var(--font\/size\/lg,14px)] text-center whitespace-nowrap`}>
        {text}
      </p>
    </div>
  );
}
