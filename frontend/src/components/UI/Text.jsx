import clsx from "clsx";

export default function Text({ variant = "default", className = "", children }) {
  const base = "leading-snug";

  const variants = {
    title: "text-3xl text-[--color-primary] font-[Onest] font-bold text-center tracking-wide",
    subtitle: "text-xl text-[--color-primary] font-semibold font-[Onest] tracking-wide",
    default: "text-base text-[--color-text] font-[Roboto]",
    muted: "text-sm text-gray-500 font-[Roboto]",
  };

  return (
    <p className={clsx(base, variants[variant], className)}>
      {children}
    </p>
  );
}