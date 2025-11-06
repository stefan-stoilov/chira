import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { CopyButton } from "./copy-button";

it("Should copy text to clipboard and be disabled for 2 seconds after that.", async () => {
  render(<CopyButton value="test" />);
  const user = userEvent.setup();
  const toastMessageSpy = vi.spyOn(toast, "message");
  const button = screen.getByRole("button");

  await user.click(button);

  await waitFor(() => {
    expect(button).toBeDisabled();
    expect(toastMessageSpy).toHaveBeenCalled();
  });

  const clipboardText = await navigator.clipboard.readText();
  expect(clipboardText).toBe("test");

  await waitFor(() => expect(button).not.toBeDisabled(), { timeout: 3000 });
});
