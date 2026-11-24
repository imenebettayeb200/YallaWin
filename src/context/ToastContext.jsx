import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback((message, type = 'success', duration = 3500) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((list) => [...list.slice(-3), { id, message, type, expiresAt: Date.now() + duration }]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return undefined;
    const soonest = Math.min(...toasts.map((t) => t.expiresAt));
    const id = window.setTimeout(() => {
      const now = Date.now();
      setToasts((list) => list.filter((t) => t.expiresAt > now));
    }, Math.max(0, soonest - Date.now()));
    return () => window.clearTimeout(id);
  }, [toasts]);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-dot" />
            <span>{t.message}</span>
            <button type="button" className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
