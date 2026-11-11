"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  title: string;
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
};

const Toast = ({
  title,
  message,
  variant = "success",
  onClose,
  duration = 3500,
}: ToastProps) => {
 
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: faCircleCheck,
    error: faCircleExclamation,
    info: faCircleInfo,
  };

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="fixed right-5 top-5 z-100 w-[calc(100%-40px)] max-w-sm animate-in slide-in-from-top-3 fade-in duration-300 overflow-hidden rounded-xl border border-gray-700/80 bg-gray-900 shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <FontAwesomeIcon icon={icons[variant]} className="text-pink-400" />

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm text-gray-100">{title}</h4>

          <p className="text-xs leading-relaxed text-gray-400">{message}</p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close notification"
          className="cursor-pointer text-gray-500 transition hover:text-white"
        >
          <FontAwesomeIcon icon={faXmark} className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
