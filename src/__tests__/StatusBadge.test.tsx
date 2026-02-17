import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/timesheets/StatusBadge";

describe("StatusBadge", () => {
    it("renders COMPLETED badge with correct text", () => {
        render(<StatusBadge status="completed" />);
        expect(screen.getByText("COMPLETED")).toBeInTheDocument();
    });

    it("renders INCOMPLETE badge with correct text", () => {
        render(<StatusBadge status="incomplete" />);
        expect(screen.getByText("INCOMPLETE")).toBeInTheDocument();
    });

    it("renders MISSING badge with correct text", () => {
        render(<StatusBadge status="missing" />);
        expect(screen.getByText("MISSING")).toBeInTheDocument();
    });

    it("applies green styling for completed status", () => {
        render(<StatusBadge status="completed" />);
        const badge = screen.getByText("COMPLETED");
        expect(badge.className).toContain("bg-green-50");
        expect(badge.className).toContain("text-green-700");
    });

    it("applies yellow styling for incomplete status", () => {
        render(<StatusBadge status="incomplete" />);
        const badge = screen.getByText("INCOMPLETE");
        expect(badge.className).toContain("bg-yellow-50");
        expect(badge.className).toContain("text-yellow-700");
    });

    it("applies red styling for missing status", () => {
        render(<StatusBadge status="missing" />);
        const badge = screen.getByText("MISSING");
        expect(badge.className).toContain("bg-red-50");
        expect(badge.className).toContain("text-red-700");
    });
});
