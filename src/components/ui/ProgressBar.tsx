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
        <div className={cn("flex items-center gap-3", className)}>
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {current}/{max} hrs
            </span>
            <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isComplete ? "bg-green-500" : current > 0 ? "bg-orange-500" : "bg-gray-300"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs text-gray-500">{percentage}%</span>
        </div>
    );
}
