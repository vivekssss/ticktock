"use client";

import Link from "next/link";
import { WeeklyTimesheet } from "@/types";
import { formatDateRange, cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TimesheetTableProps {
    timesheets: WeeklyTimesheet[];
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSort: (column: string) => void;
}

function SortIcon({ column, sortBy, sortOrder }: { column: string; sortBy: string; sortOrder: string }) {
    if (sortBy !== column) {
        return <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400 ml-1" />;
    }
    return sortOrder === "asc" ? (
        <ChevronUpIcon className="h-3.5 w-3.5 text-gray-700 ml-1" />
    ) : (
        <ChevronDownIcon className="h-3.5 w-3.5 text-gray-700 ml-1" />
    );
}

export default function TimesheetTable({
    timesheets,
    sortBy,
    sortOrder,
    onSort,
}: TimesheetTableProps) {
    const getActionLabel = (status: string) => {
        switch (status) {
            case "completed":
                return "View";
            case "incomplete":
                return "Update";
            case "missing":
                return "Create";
            default:
                return "View";
        }
    };

    const getActionColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-[#2563EB] hover:text-[#1D4ED8]";
            case "incomplete":
                return "text-[#2563EB] hover:text-[#1D4ED8]";
            case "missing":
                return "text-[#2563EB] hover:text-[#1D4ED8]";
            default:
                return "text-[#2563EB] hover:text-[#1D4ED8]";
        }
    };

    if (timesheets.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No timesheets found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th
                            className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => onSort("weekNumber")}
                        >
                            <span className="flex items-center">
                                Week #
                                <SortIcon column="weekNumber" sortBy={sortBy} sortOrder={sortOrder} />
                            </span>
                        </th>
                        <th
                            className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => onSort("startDate")}
                        >
                            <span className="flex items-center">
                                Date
                                <SortIcon column="startDate" sortBy={sortBy} sortOrder={sortOrder} />
                            </span>
                        </th>
                        <th
                            className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => onSort("status")}
                        >
                            <span className="flex items-center">
                                Status
                                <SortIcon column="status" sortBy={sortBy} sortOrder={sortOrder} />
                            </span>
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {timesheets.map((timesheet) => (
                        <tr
                            key={timesheet.id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                                {timesheet.weekNumber}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                                {formatDateRange(timesheet.startDate, timesheet.endDate)}
                            </td>
                            <td className="py-4 px-4">
                                <StatusBadge status={timesheet.status} />
                            </td>
                            <td className="py-4 px-4 text-right">
                                <Link
                                    href={`/dashboard/${timesheet.id}`}
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        getActionColor(timesheet.status)
                                    )}
                                >
                                    {getActionLabel(timesheet.status)}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
