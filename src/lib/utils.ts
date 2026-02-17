import { format, parseISO } from "date-fns";

export function formatDateRange(startDate: string, endDate: string): string {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const startMonth = format(start, "MMMM");
    const endMonth = format(end, "MMMM");
    const year = format(end, "yyyy");

    if (startMonth === endMonth) {
        return `${format(start, "d")} - ${format(end, "d")} ${startMonth}, ${year}`;
    }
    return `${format(start, "d")} ${startMonth} - ${format(end, "d")} ${endMonth}, ${year}`;
}

export function formatShortDate(date: string): string {
    return format(parseISO(date), "MMM d");
}

export function formatFullDate(date: string): string {
    return format(parseISO(date), "d MMMM, yyyy");
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

export function getStatusColor(status: string): {
    bg: string;
    text: string;
    label: string;
} {
    switch (status) {
        case "completed":
            return { bg: "bg-green-50", text: "text-green-700", label: "COMPLETED" };
        case "incomplete":
            return { bg: "bg-yellow-50", text: "text-yellow-700", label: "INCOMPLETE" };
        case "missing":
            return { bg: "bg-red-50", text: "text-red-700", label: "MISSING" };
        default:
            return { bg: "bg-gray-50", text: "text-gray-700", label: status.toUpperCase() };
    }
}
