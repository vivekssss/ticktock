"use client";

import Link from "next/link";
import { WeeklyTimesheet } from "@/types";
import { formatDateRange, cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { ArrowUpIcon, ArrowSmallDownIcon } from "@heroicons/react/24/outline";

interface TimesheetTableProps {
    timesheets: WeeklyTimesheet[];
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSort: (column: string) => void;
}

function SortIcon({ column, sortBy, sortOrder }: { column: string; sortBy: string; sortOrder: string }) {
    return (
        <div className="flex flex-col ml-1.5 transition-opacity">
            <ArrowUpIcon
                className={cn(
                    "h-3 w-3 transition-all duration-200",
                    sortBy === column ? "text-gray-900 opacity-100" : "text-gray-500 opacity-60 group-hover:opacity-100",
                    sortBy === column && sortOrder === "desc" && "rotate-180"
                )}
            />
        </div>
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAFB] border-b border-gray-200">
                        <tr>
                            <th
                                className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r border-gray-100/50 w-[140px]"
                                onClick={() => onSort("weekNumber")}
                            >
                                <span className="flex items-center group">
                                    WEEK #
                                    <SortIcon column="weekNumber" sortBy={sortBy} sortOrder={sortOrder} />
                                </span>
                            </th>
                            <th
                                className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                                onClick={() => onSort("startDate")}
                            >
                                <span className="flex items-center group">
                                    DATE
                                    <SortIcon column="startDate" sortBy={sortBy} sortOrder={sortOrder} />
                                </span>
                            </th>
                            <th
                                className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                                onClick={() => onSort("status")}
                            >
                                <span className="flex items-center group">
                                    STATUS
                                    <SortIcon column="status" sortBy={sortBy} sortOrder={sortOrder} />
                                </span>
                            </th>
                            <th className="py-4 px-6 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {timesheets.map((timesheet) => (
                            <tr
                                key={timesheet.id}
                                className="hover:bg-gray-50/30 transition-colors group"
                            >
                                <td className="py-5 px-6 text-sm text-gray-900 font-medium bg-[#F9FAFB] border-r border-gray-100/50 w-[140px]">
                                    {timesheet.weekNumber}
                                </td>
                                <td className="py-5 px-6 text-sm text-gray-500 font-normal">
                                    {formatDateRange(timesheet.startDate, timesheet.endDate)}
                                </td>
                                <td className="py-5 px-6">
                                    <StatusBadge status={timesheet.status} />
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <Link
                                        href={`/dashboard/${timesheet.id}`}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:underline",
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
        </div>
    );
}
