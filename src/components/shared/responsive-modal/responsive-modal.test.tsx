import { render, screen } from "@testing-library/react";
import { ResponsiveModal } from "./responsive-modal";
import { mockMatchMedia } from "@/tests/utils";

describe("ResponsiveModal test", () => {
  it("Should render a drawer when media does not match the minimum width.", () => {
    mockMatchMedia(false);

    render(
      <ResponsiveModal
        isOpen
        title="test"
        description="test"
        onOpenChange={vi.fn()}
      >
        <p data-testid="children">Test</p>
      </ResponsiveModal>,
    );

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAttribute("data-vaul-drawer-direction");
    expect(screen.getByTestId("children")).toBeDefined();
  });

  it("Should render a dialog when media does match the minimum width.", () => {
    mockMatchMedia(true);

    render(
      <ResponsiveModal
        isOpen
        title="test"
        description="test"
        onOpenChange={vi.fn()}
      >
        <p data-testid="children">Test</p>
      </ResponsiveModal>,
    );

    const dialog = screen.getByRole("dialog");

    expect(dialog).not.toHaveAttribute("data-vaul-drawer-direction");
    expect(screen.getByTestId("children")).toBeDefined();
  });
});
