"use client";

import { TimesheetStatus } from "@/types";
import DateRangeDropdown from "./DateRangeDropdown";
import CustomSelect from "../ui/CustomSelect";

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
    const statuses = [
        { value: "all", label: "Status" },
        { value: "completed", label: "Completed" },
        { value: "incomplete", label: "Incomplete" },
        { value: "missing", label: "Missing" },
    ];

    const handleRangeChange = (start: string, end: string) => {
        onStartDateChange(start);
        onEndDateChange(end);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Date range filter */}
            <DateRangeDropdown
                startDate={startDate}
                endDate={endDate}
                onRangeChange={handleRangeChange}
            />

            {/* Status filter */}
            <CustomSelect
                value={statusFilter}
                onChange={(val) => onStatusChange(val)}
                options={statuses}
                className="w-full sm:w-44"
                placeholder="Status"
            />
        </div>
    );
}
