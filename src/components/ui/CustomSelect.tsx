"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface Option {
    value: string | number;
    label: string;
}

interface CustomSelectProps {
    value: string | number;
    onChange: (value: any) => void;
    options: Option[];
    className?: string;
    placeholder?: string;
    prefix?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    className,
    placeholder,
    prefix,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string | number) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative inline-block", className)} ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-all select-none"
            >
                <div className="flex items-center gap-1 overflow-hidden">
                    {prefix && <span className="text-gray-500 whitespace-nowrap">{prefix}</span>}
                    <span className={cn("truncate", !selectedOption && "text-gray-400")}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDownIcon
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0",
                        isOpen && "transform rotate-180 text-gray-900"
                    )}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full min-w-[max-content] bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={cn(
                                "px-4 py-2 text-sm cursor-pointer transition-colors",
                                opt.value === value
                                    ? "bg-blue-50 text-[#2563EB] font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
