"use client";

import { useToast } from "@/context/ToastContext";
import {
  FaCheck,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheck size={18} />;
      case "error":
        return <FaExclamationCircle size={18} />;
      case "warning":
        return <FaExclamationCircle size={18} />;
      case "info":
        return <FaInfoCircle size={18} />;
      default:
        return null;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-5
            flex items-center gap-3 transition-all duration-300
            ${getColors(toast.type)}
          `}
        >
          <div className={getIconColors(toast.type)}>{getIcon(toast.type)}</div>
          <p className="flex-1 font-medium text-sm">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-60 hover:opacity-100 transition"
          >
            <FaTimes size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
