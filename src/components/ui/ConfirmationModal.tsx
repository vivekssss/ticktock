"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false,
}: ConfirmationModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />,
            iconBg: "bg-red-50",
            confirmBtn: "bg-red-600 hover:bg-red-700",
        },
        warning: {
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />,
            iconBg: "bg-amber-50",
            confirmBtn: "bg-amber-600 hover:bg-amber-700",
        },
        info: {
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />,
            iconBg: "bg-blue-50",
            confirmBtn: "bg-blue-600 hover:bg-blue-700",
        },
    };

    const currentVariant = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-xl shrink-0", currentVariant.iconBg)}>
                            {currentVariant.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 leading-6 mb-1">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all uppercase tracking-wider"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "px-8 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider",
                                currentVariant.confirmBtn
                            )}
                        >
                            {isLoading ? "Processing..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
