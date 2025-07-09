import clsx from "clsx";

export default function Text({ variant = "default", className = "", children }) {
  const base = "leading-snug";

  const variants = {
    title: "text-3xl font-bold text-[--color-primary] text-center font-[Onest] tracking-tight",
    subtitle: "text-xl font-semibold text-[--color-primary] font-[Onest] tracking-normal",
    default: "text-base text-[--color-text] font-[Roboto]",
    muted: "text-sm text-[--color-muted] font-[Roboto]",
  };

  return (
    <p className={clsx(base, variants[variant], className)}>
      {children}
    </p>
  );
}
