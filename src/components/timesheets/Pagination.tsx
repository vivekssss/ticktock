"use client";

import CustomSelect from "../ui/CustomSelect";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    const pageSizeOptions = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
    ];

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
                <CustomSelect
                    value={pageSize}
                    onChange={(val) => onPageSizeChange(val)}
                    options={pageSizeOptions}
                    className="w-32"
                />
                <span className="text-sm text-gray-500">per page</span>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-1">
                        <ChevronLeftIcon className="h-4 w-4" />
                        Previous
                    </span>
                </button>

                {getPageNumbers().map((page, i) =>
                    typeof page === "string" ? (
                        <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-400">
                            {page}
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "px-3 py-1 text-sm rounded-md transition-colors",
                                currentPage === page
                                    ? "bg-[#2563EB] text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-1">
                        Next
                        <ChevronRightIcon className="h-4 w-4" />
                    </span>
                </button>
            </div>
        </div>
    );
}
