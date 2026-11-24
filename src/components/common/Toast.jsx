import { useEffect } from "react";

/* Toast — small message at the bottom of the screen. It closes itself after 3.5 seconds. */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;
  return (
    <div className="toast-stack" role="status">
      <div className={"toast toast-" + toast.type}>
        <span className="toast-dot"></span>
        <span>{toast.text}</span>
        <button type="button" className="toast-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
