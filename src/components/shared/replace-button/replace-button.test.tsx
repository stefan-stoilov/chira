import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReplaceButton } from "./replace-button";

const replace = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

it("Should call router.replace() with its passed 'path' prop when clicked.", async () => {
  render(<ReplaceButton path="/test">Replace</ReplaceButton>);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button"));
  expect(replace).toHaveBeenCalledWith("/test");
});
