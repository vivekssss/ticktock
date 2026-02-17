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
            return {
                bg: "bg-[#EBFDF5]",
                text: "text-[#059669]",
                label: "COMPLETED"
            };
        case "incomplete":
            return {
                bg: "bg-[#FFFBEB]",
                text: "text-[#D97706]",
                label: "INCOMPLETE"
            };
        case "missing":
            return {
                bg: "bg-[#FFF1F2]",
                text: "text-[#E11D48]",
                label: "MISSING"
            };
        default:
            return {
                bg: "bg-gray-50",
                text: "text-gray-600",
                label: status.toUpperCase()
            };
    }
}
