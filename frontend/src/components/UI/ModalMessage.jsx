import clsx from "clsx";

export default function ModalMessage({
  open,
  mode = "notification", // "notification" или "confirmation"
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
        className="bg-white rounded-2xl shadow-xl p-6 min-w-[320px] max-w-[90vw] border border-[--color-border]"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-lg font-semibold text-center text-[--color-primary] mb-4">
            {title}
          </h2>
        )}
        <div className="text-[--color-primary] whitespace-pre-wrap text-center mb-6">
          {message}
        </div>

        <div className="flex justify-center gap-4">
          {mode === "notification" && (
            <button
              className="px-6 py-2 rounded-xl bg-[--color-secondary] text-white hover:bg-[--color-primary] shadow"
              onClick={onCancel}
            >
              ОК
            </button>
          )}

          {mode === "confirmation" && (
            <>
              <button
                className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={onCancel}
              >
                Отмена
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-[--color-secondary] text-white hover:bg-[--color-primary] shadow"
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
