import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import clsx from "clsx";

export default function PageWrapper({
  title,
  description,
  onBack,
  actions = null,
  children,
  className = "",
  maxWidth = null, // теперь по умолчанию нет ограничений
}) {
  return (
    <div className={clsx("group-box h-full flex flex-col", className)}>
      {/* Заголовок страницы */}
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <div className="flex flex-col gap-1">
          {title && <Label text={title} />}
          {description && (
            <p className="text-sm text-[--color-primary]/80 font-[Roboto]">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {onBack && <Button onClick={onBack}>Назад</Button>}
          {actions}
        </div>
      </div>

      {/* Контент */}
      <div
        className={clsx("w-full", {
          "max-w-[1400px]": maxWidth === "default",
          "max-w-none": maxWidth === null,
          [maxWidth]: typeof maxWidth === "string" && maxWidth !== "default",
        })}
      >
        {children}
      </div>
    </div>
  );
}