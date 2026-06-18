type SuggestionChipProps = {
  children: React.ReactNode;
  action: (formData: FormData) => Promise<void>;
  message: string;
};

export function SuggestionChip({ children, action, message }: SuggestionChipProps) {
  return (
    <form action={action}>
      <input type="hidden" name="message" value={message} />
      <button
        type="submit"
        className={String.raw`bg-[var(--bg-elevated,#181c23)] border border-[var(--border-default,rgba(255,255,255,0.14))] border-solid flex items-center px-[14px] py-[8px] rounded-[var(--radius-chip,20px)] shrink-0 cursor-pointer hover:bg-[var(--bg-hover,#1e2330)] transition-colors`}
      >
        <span className={String.raw`font-medium leading-normal text-[color:var(--text-secondary,#8b92a0)] text-[13px] whitespace-nowrap`}>
          {children}
        </span>
      </button>
    </form>
  );
}
