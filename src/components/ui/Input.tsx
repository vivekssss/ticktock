"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        "w-full px-3 py-2.5 border rounded-lg text-sm transition-colors",
                        "placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent",
                        error
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 hover:border-gray-400",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
