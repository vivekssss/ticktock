"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWeekDetail, createEntry, updateEntry, deleteEntry } from "@/lib/api";
import { WeeklyTimesheet, TimesheetEntry } from "@/types";
import { formatDateRange, formatShortDate } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import EntryModal from "@/components/entries/EntryModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<TimesheetEntry | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
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

    const handleDeleteClick = (entry: TimesheetEntry) => {
        setEntryToDelete(entry);
        setDeleteModalOpen(true);
        setMenuOpen(null);
    };

    const confirmDeleteEntry = async () => {
        if (!entryToDelete) return;

        setIsDeleting(true);
        try {
            await deleteEntry(weekId, entryToDelete.id);
            await loadData();
            setDeleteModalOpen(false);
        } catch (err) {
            console.error("Failed to delete entry:", err);
        } finally {
            setIsDeleting(false);
            setEntryToDelete(null);
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-10 max-w-[1200px] mx-auto min-h-[90vh]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                <div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-gray-600 mb-6 transition-colors group"
                    >
                        <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        Back to timesheets
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        This week&apos;s timesheet
                    </h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">
                        {formatDateRange(week.startDate, week.endDate)}
                    </p>
                </div>
                <div className="md:mt-2">
                    <ProgressBar current={week.totalHours} max={40} />
                </div>
            </div>

            {/* Day-by-day entries */}
            <div className="space-y-10">
                {getDatesInRange().map((date) => {
                    const dayEntries = entriesByDate(date);
                    const formattedDate = formatShortDate(date); // e.g., "Jan 21"

                    return (
                        <div key={date} className="flex flex-col md:flex-row gap-4 md:gap-10">
                            {/* Date label */}
                            <div className="w-24 shrink-0 pt-3">
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    {formattedDate}
                                </p>
                            </div>

                            {/* Entries container */}
                            <div className="flex-1 space-y-2">
                                {dayEntries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="relative flex items-center justify-between py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:border-blue-200 group transition-all duration-200"
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <span className="text-[13px] text-gray-700 font-medium truncate block">
                                                {entry.taskDescription}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
                                                {entry.hours} hrs
                                            </span>
                                            <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
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
                                                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                                                >
                                                    <EllipsisHorizontalIcon className="h-5 w-5" />
                                                </button>

                                                {menuOpen === entry.id && (
                                                    <div className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                                        <button
                                                            onClick={() => handleEditEntry(entry)}
                                                            className="w-full text-left px-5 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#2563EB] transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(entry)}
                                                            className="w-full text-left px-5 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add new task button */}
                                <button
                                    onClick={() => handleAddEntry(date)}
                                    className="flex items-center gap-2 text-[11px] font-bold text-[#2563EB] py-2.5 px-5 rounded-xl border-2 border-dashed border-blue-200 bg-[#EFF6FF]/60 hover:bg-[#EFF6FF] w-full justify-center transition-all group"
                                >
                                    <PlusIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                                    <span className="uppercase tracking-widest">Add new task</span>
                                </button>
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

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteEntry}
                title="Delete Entry"
                message="Are you sure you want to delete this timesheet entry? This action cannot be undone."
                confirmText="Delete Entry"
                variant="danger"
                isLoading={isDeleting}
            />

            {/* Footer space */}
            <div className="mt-20 py-8 border-t border-gray-50 flex justify-center">
                <p className="text-[11px] text-gray-300 font-medium uppercase tracking-[0.2em]">
                    © 2024 tentwenty. All rights reserved.
                </p>
            </div>
        </div>
    );
}
