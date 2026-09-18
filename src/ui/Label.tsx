export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span aria-hidden className="inline-block h-px w-8 bg-line-strong" />
      {children}
    </p>
  );
}
