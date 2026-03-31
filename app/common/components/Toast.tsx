type ToastProps = {
  message: string | null;
};

export default function Toast({ message }: ToastProps) {
  const visible = Boolean(message);

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-md border border-[#B55252]/25 bg-[#FDEBEC] px-3 py-2 text-sm font-medium text-[#7A1F1F] shadow-sm transition-all duration-150 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
      }`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      {message}
    </div>
  );
}
