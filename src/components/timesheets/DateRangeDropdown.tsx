"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { format, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeDropdownProps {
    startDate: string;
    endDate: string;
    onRangeChange: (start: string, end: string) => void;
}

type RangeOption = "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth" | "custom" | "all";

export default function DateRangeDropdown({ startDate, endDate, onRangeChange }: DateRangeDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<RangeOption>("all");
    const [customStart, setCustomStart] = useState(startDate || "");
    const [customEnd, setCustomEnd] = useState(endDate || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (startDate) setCustomStart(startDate);
        if (endDate) setCustomEnd(endDate);
    }, [startDate, endDate]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionSelect = (option: RangeOption) => {
        const today = new Date();
        let newStart = "";
        let newEnd = "";

        switch (option) {
            case "all":
                newStart = "";
                newEnd = "";
                break;
            case "thisWeek":
                newStart = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
                newEnd = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
                break;
            case "lastWeek":
                const lastWeek = subWeeks(today, 1);
                newStart = format(startOfWeek(lastWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");
                newEnd = format(endOfWeek(lastWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");
                break;
            case "thisMonth":
                newStart = format(startOfMonth(today), "yyyy-MM-dd");
                newEnd = format(endOfMonth(today), "yyyy-MM-dd");
                break;
            case "lastMonth":
                const lastMonth = subMonths(today, 1);
                newStart = format(startOfMonth(lastMonth), "yyyy-MM-dd");
                newEnd = format(endOfMonth(lastMonth), "yyyy-MM-dd");
                break;
            case "custom":
                setSelectedOption("custom");
                return;
        }

        setSelectedOption(option);
        onRangeChange(newStart, newEnd);
        setIsOpen(false);
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedOption("all");
        onRangeChange("", "");
        setCustomStart("");
        setCustomEnd("");
        setIsOpen(false);
    };

    const getLabel = () => {
        if (!startDate && !endDate) return "Date Range";

        switch (selectedOption) {
            case "thisWeek": return "This Week";
            case "lastWeek": return "Last Week";
            case "thisMonth": return "This Month";
            case "lastMonth": return "Last Month";
            case "custom":
                try {
                    return `${format(parseISO(startDate), "MMM d")} - ${format(parseISO(endDate), "MMM d")}`;
                } catch (e) {
                    return "Custom Range";
                }
            default: return "Date Range";
        }
    };

    const isActive = !!(startDate || endDate);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg pl-4 pr-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-transparent min-w-[200px] justify-between transition-all"
            >
                <span className={cn("truncate", !isActive ? "text-gray-500" : "text-gray-900 font-medium")}>
                    {getLabel()}
                </span>
                <div className="flex items-center gap-1">
                    {isActive && (
                        <button
                            onClick={handleReset}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDownIcon className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "transform rotate-180")} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button onClick={() => handleOptionSelect("thisWeek")} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50", selectedOption === "thisWeek" ? "text-[#2563EB] bg-blue-50/50 font-medium" : "text-gray-700")}>This Week</button>
                    <button onClick={() => handleOptionSelect("lastWeek")} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50", selectedOption === "lastWeek" ? "text-[#2563EB] bg-blue-50/50 font-medium" : "text-gray-700")}>Last Week</button>
                    <button onClick={() => handleOptionSelect("thisMonth")} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50", selectedOption === "thisMonth" ? "text-[#2563EB] bg-blue-50/50 font-medium" : "text-gray-700")}>This Month</button>
                    <button onClick={() => handleOptionSelect("lastMonth")} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50", selectedOption === "lastMonth" ? "text-[#2563EB] bg-blue-50/50 font-medium" : "text-gray-700")}>Last Month</button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => setSelectedOption("custom")} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50", selectedOption === "custom" ? "text-[#2563EB] bg-blue-50/50 font-medium" : "text-gray-700")}>Custom Range</button>

                    {selectedOption === "custom" && (
                        <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block px-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all shadow-sm"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block px-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all shadow-sm"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (customStart && customEnd) {
                                        onRangeChange(customStart, customEnd);
                                        setIsOpen(false);
                                    }
                                }}
                                disabled={!customStart || !customEnd}
                                className="w-full bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
