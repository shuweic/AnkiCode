import { useState } from 'react';

interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
};

