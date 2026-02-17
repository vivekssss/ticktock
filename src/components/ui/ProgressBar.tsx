"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
    current: number;
    max: number;
    className?: string;
}

export default function ProgressBar({ current, max, className }: ProgressBarProps) {
    const percentage = Math.min(Math.round((current / max) * 100), 100);
    const isComplete = current >= max;

    return (
        <div className={cn("flex flex-col items-end gap-1.5 min-w-[180px]", className)}>
            <div className="flex justify-between items-baseline w-full px-0.5">
                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">
                    {current}/{max} hrs
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{percentage}%</span>
            </div>
            <div className="relative w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        isComplete ? "bg-green-500" : current > 0 ? "bg-[#FF8A65]" : "bg-gray-200"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
