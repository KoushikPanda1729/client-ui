import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("applies correct variant styles", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText("Primary")).toHaveClass("bg-blue-600");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText("Danger")).toHaveClass("bg-red-600");
  });
});
