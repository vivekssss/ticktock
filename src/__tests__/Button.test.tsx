import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/ui/Button";

describe("Button", () => {
    it("renders children text", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("applies primary variant styles by default", () => {
        render(<Button>Primary</Button>);
        const btn = screen.getByText("Primary");
        expect(btn.className).toContain("bg-[#2563EB]");
    });

    it("applies secondary variant styles", () => {
        render(<Button variant="secondary">Secondary</Button>);
        const btn = screen.getByText("Secondary");
        expect(btn.className).toContain("border-gray-300");
    });

    it("shows loading spinner when isLoading is true", () => {
        render(<Button isLoading>Loading</Button>);
        const btn = screen.getByText("Loading").closest("button");
        expect(btn).toBeDisabled();
        expect(btn?.querySelector("svg.animate-spin")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();
        render(<Button onClick={handleClick}>Click</Button>);
        await user.click(screen.getByText("Click"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();
        render(<Button onClick={handleClick} disabled>Click</Button>);
        await user.click(screen.getByText("Click"));
        expect(handleClick).not.toHaveBeenCalled();
    });
});
