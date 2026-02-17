import { formatDateRange, formatShortDate, getStatusColor, cn } from "@/lib/utils";

describe("Utility functions", () => {
    describe("formatDateRange", () => {
        it("formats dates in the same month", () => {
            const result = formatDateRange("2024-01-01", "2024-01-05");
            expect(result).toBe("1 - 5 January, 2024");
        });

        it("formats dates across months", () => {
            const result = formatDateRange("2024-01-29", "2024-02-02");
            expect(result).toBe("29 January - 2 February, 2024");
        });
    });

    describe("formatShortDate", () => {
        it("formats date as short format", () => {
            expect(formatShortDate("2024-01-21")).toBe("Jan 21");
        });
    });

    describe("getStatusColor", () => {
        it("returns green for completed", () => {
            const result = getStatusColor("completed");
            expect(result.label).toBe("COMPLETED");
            expect(result.bg).toContain("green");
        });

        it("returns yellow for incomplete", () => {
            const result = getStatusColor("incomplete");
            expect(result.label).toBe("INCOMPLETE");
            expect(result.bg).toContain("yellow");
        });

        it("returns red for missing", () => {
            const result = getStatusColor("missing");
            expect(result.label).toBe("MISSING");
            expect(result.bg).toContain("red");
        });
    });

    describe("cn", () => {
        it("joins multiple classes", () => {
            expect(cn("foo", "bar")).toBe("foo bar");
        });

        it("filters falsy values", () => {
            expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
        });
    });
});
