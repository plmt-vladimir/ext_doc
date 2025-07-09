import clsx from "clsx";

export default function ModalMessage({
  open,
  mode = "notification", 
  title = "",
  message = "",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 min-w-[320px] max-w-[90vw] border border-[--color-border] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-xl font-bold text-center text-[--color-primary] mb-4 leading-tight">
            {title}
          </h2>
        )}

        {message && (
          <div className="text-center text-[--color-text] whitespace-pre-wrap mb-6 text-base">
            {message}
          </div>
        )}

        <div className={clsx("flex justify-center gap-4", mode === "confirmation" && "mt-4")}>
          {mode === "notification" && (
            <button
              className="px-6 py-2 rounded-xl bg-[--color-secondary] text-white hover:bg-[--color-primary] transition shadow"
              onClick={onCancel}
            >
              ОК
            </button>
          )}

          {mode === "confirmation" && (
            <>
              <button
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={onCancel}
              >
                Отмена
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-[--color-secondary] text-white hover:bg-[--color-primary] transition shadow"
                onClick={onConfirm}
              >
                Подтвердить
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

