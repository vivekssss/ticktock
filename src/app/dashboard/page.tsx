"use client";

import { useState, useEffect, useCallback } from "react";
import TimesheetTable from "@/components/timesheets/TimesheetTable";
import TimesheetFilters from "@/components/timesheets/TimesheetFilters";
import Pagination from "@/components/timesheets/Pagination";
import { fetchTimesheets } from "@/lib/api";
import { WeeklyTimesheet } from "@/types";

export default function DashboardPage() {
    const [timesheets, setTimesheets] = useState<WeeklyTimesheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Sorting
    const [sortBy, setSortBy] = useState("weekNumber");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const loadTimesheets = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetchTimesheets({
                status: statusFilter !== "all" ? statusFilter : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                page,
                pageSize,
                sortBy,
                sortOrder,
            });

            setTimesheets(response.data);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError("Failed to load timesheets. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, startDate, endDate, page, pageSize, sortBy, sortOrder]);

    useEffect(() => {
        loadTimesheets();
    }, [loadTimesheets]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [statusFilter, startDate, endDate]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-6">
                Your Timesheets
            </h1>

            <TimesheetFilters
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <svg
                            className="animate-spin h-8 w-8 text-[#2563EB]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span className="text-sm text-gray-500">Loading timesheets...</span>
                    </div>
                </div>
            ) : (
                <>
                    <TimesheetTable
                        timesheets={timesheets}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    />

                    {totalPages > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setPage(1);
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}
