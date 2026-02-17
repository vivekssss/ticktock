"use client";

import { TimesheetStatus } from "@/types";

interface TimesheetFiltersProps {
    statusFilter: string;
    onStatusChange: (status: string) => void;
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export default function TimesheetFilters({
    statusFilter,
    onStatusChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: TimesheetFiltersProps) {
    const statuses: { value: string; label: string }[] = [
        { value: "all", label: "All Statuses" },
        { value: "completed", label: "Completed" },
        { value: "incomplete", label: "Incomplete" },
        { value: "missing", label: "Missing" },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Date range filter */}
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="Start date"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="End date"
                />
            </div>

            {/* Status filter */}
            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as TimesheetStatus | "all")}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            >
                {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
