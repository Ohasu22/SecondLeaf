import { useToast } from "../hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from "../../components/ui/toast";

type ToastItem = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function Toaster() {
  const { toasts } = useToast() as { toasts: ToastItem[] };

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          {toast.action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
