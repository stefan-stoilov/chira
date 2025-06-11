import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BackButton } from "./back-button";

const back = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ back }) }));

it("Should call router.back() when clicked.", async () => {
  render(<BackButton>Back</BackButton>);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button"));
  expect(back).toHaveBeenCalled();
});
