"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWeekDetail, createEntry, updateEntry, deleteEntry } from "@/lib/api";
import { WeeklyTimesheet, TimesheetEntry } from "@/types";
import { formatDateRange, formatShortDate } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import EntryModal from "@/components/entries/EntryModal";
import Button from "@/components/ui/Button";
import {
    ArrowLeftIcon,
    PlusIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function WeekDetailPage() {
    const params = useParams();
    const router = useRouter();
    const weekId = params.weekId as string;

    const [week, setWeek] = useState<WeeklyTimesheet | null>(null);
    const [entries, setEntries] = useState<TimesheetEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Dropdown menu
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await fetchWeekDetail(weekId);
            setWeek(data.week);
            setEntries(data.entries);
        } catch (err) {
            setError("Failed to load timesheet details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [weekId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Close menu on outside click
    useEffect(() => {
        const handleClick = () => setMenuOpen(null);
        if (menuOpen) {
            document.addEventListener("click", handleClick);
        }
        return () => document.removeEventListener("click", handleClick);
    }, [menuOpen]);

    const handleAddEntry = (date: string) => {
        setEditingEntry(null);
        setSelectedDate(date);
        setModalOpen(true);
    };

    const handleEditEntry = (entry: TimesheetEntry) => {
        setEditingEntry(entry);
        setSelectedDate(entry.date);
        setModalOpen(true);
        setMenuOpen(null);
    };

    const handleDeleteEntry = async (entry: TimesheetEntry) => {
        setMenuOpen(null);
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            await deleteEntry(weekId, entry.id);
            await loadData();
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    };

    const handleSubmitEntry = async (data: {
        taskDescription: string;
        project: string;
        typeOfWork: string;
        hours: number;
        date: string;
    }) => {
        if (editingEntry) {
            await updateEntry(weekId, editingEntry.id, data);
        } else {
            await createEntry(weekId, data);
        }
        await loadData();
    };

    // Group entries by date
    const getDatesInRange = () => {
        if (!week) return [];
        const dates: string[] = [];
        const start = new Date(week.startDate);
        const end = new Date(week.endDate);

        const current = new Date(start);
        while (current <= end) {
            dates.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const entriesByDate = (date: string) =>
        entries.filter((e) => e.date === date);

    if (loading) {
        return (
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
                    <span className="text-sm text-gray-500">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !week) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 mb-4">{error || "Week not found"}</p>
                <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to timesheets
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">
                        This week&apos;s timesheet
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {formatDateRange(week.startDate, week.endDate)}
                    </p>
                </div>
                <ProgressBar current={week.totalHours} max={40} />
            </div>

            {/* Day-by-day entries */}
            <div className="space-y-2">
                {getDatesInRange().map((date) => {
                    const dayEntries = entriesByDate(date);

                    return (
                        <div key={date} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="flex items-start gap-6 py-3">
                                {/* Date label */}
                                <div className="w-20 shrink-0">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatShortDate(date)}
                                    </p>
                                </div>

                                {/* Entries */}
                                <div className="flex-1 space-y-2">
                                    {dayEntries.length > 0 ? (
                                        dayEntries.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 group transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <span className="text-sm text-gray-700">
                                                        {entry.taskDescription}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm text-gray-500">
                                                        {entry.hours} hrs
                                                    </span>
                                                    <span className="text-xs font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                                                        {entry.project}
                                                    </span>
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuOpen(
                                                                    menuOpen === entry.id ? null : entry.id
                                                                );
                                                            }}
                                                            className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
                                                        </button>

                                                        {menuOpen === entry.id && (
                                                            <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                                <button
                                                                    onClick={() => handleEditEntry(entry)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEntry(entry)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : null}

                                    {/* Add new task button */}
                                    <button
                                        onClick={() => handleAddEntry(date)}
                                        className="flex items-center gap-1.5 text-sm text-[#2563EB] hover:text-[#1D4ED8] py-2 px-3 rounded-lg border border-dashed border-blue-200 hover:border-blue-400 w-full justify-center transition-colors"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        Add new task
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Entry Modal */}
            <EntryModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingEntry(null);
                }}
                onSubmit={handleSubmitEntry}
                entry={editingEntry}
                date={selectedDate}
            />
        </div>
    );
}
