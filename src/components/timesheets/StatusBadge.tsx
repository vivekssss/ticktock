"use client";

import { getStatusColor } from "@/lib/utils";
import { TimesheetStatus } from "@/types";

interface StatusBadgeProps {
    status: TimesheetStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { bg, text, label } = getStatusColor(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${bg} ${text}`}
        >
            {label}
        </span>
    );
}
