import React from "react";
import { Toast } from "../lib/hooks/useToast";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

interface ToastNotificationProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onRemoveToast,
}) => {
  const getToastIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-400" />;
      case "error":
        return <FaExclamationTriangle className="text-red-400" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-400" />;
      case "info":
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getToastColors = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-900/90 border-green-500/50 text-green-100";
      case "error":
        return "bg-red-900/90 border-red-500/50 text-red-100";
      case "warning":
        return "bg-yellow-900/90 border-yellow-500/50 text-yellow-100";
      case "info":
        return "bg-blue-900/90 border-blue-500/50 text-blue-100";
      default:
        return "bg-gray-900/90 border-gray-500/50 text-gray-100";
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getToastColors(toast.type)}
            border rounded-lg p-4 shadow-lg backdrop-blur-sm
            animate-in slide-in-from-right duration-300
            flex items-start gap-3 min-w-0
          `}
        >
          <div className="flex-shrink-0 mt-1">{getToastIcon(toast.type)}</div>
          <div className="flex-1 text-sm leading-relaxed break-words min-w-0">
            {toast.message}
          </div>
          <button
            onClick={() => onRemoveToast(toast.id)}
            className="flex-shrink-0 text-current/70 hover:text-current transition-colors mt-0.5"
            aria-label="Close notification"
          >
            <FaTimes size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
