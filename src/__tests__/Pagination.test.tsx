import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "@/components/timesheets/Pagination";

describe("Pagination", () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 5,
        pageSize: 5,
        onPageChange: jest.fn(),
        onPageSizeChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders page numbers", () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("highlights the current page", () => {
        render(<Pagination {...defaultProps} currentPage={3} />);
        const page3Button = screen.getByText("3");
        expect(page3Button.className).toContain("bg-[#2563EB]");
    });

    it("disables Previous button on first page", () => {
        render(<Pagination {...defaultProps} currentPage={1} />);
        const previousButtons = screen.getAllByText("Previous");
        expect(previousButtons[0].closest("button")).toBeDisabled();
    });

    it("disables Next button on last page", () => {
        render(<Pagination {...defaultProps} currentPage={5} />);
        const nextButtons = screen.getAllByText("Next");
        expect(nextButtons[0].closest("button")).toBeDisabled();
    });

    it("calls onPageChange when clicking a page number", async () => {
        const user = userEvent.setup();
        render(<Pagination {...defaultProps} />);
        await user.click(screen.getByText("3"));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    });

    it("calls onPageChange when clicking Next", async () => {
        const user = userEvent.setup();
        render(<Pagination {...defaultProps} currentPage={2} />);
        const nextButtons = screen.getAllByText("Next");
        await user.click(nextButtons[0]);
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    });

    it("renders page size selector", () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByDisplayValue("5 per page")).toBeInTheDocument();
    });
});
