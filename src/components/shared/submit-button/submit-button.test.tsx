import { render, screen } from "@testing-library/react";
import { SubmitButton } from "./submit-button";

it("Should not be disabled when properties isPending is not true and isDirty does not equal false.", () => {
  render(<SubmitButton isPending={false}>Test</SubmitButton>);
  expect(screen.getByRole("button")).not.toBeDisabled();
});

it("Should be disabled when isPending property is true and display a loader.", () => {
  render(<SubmitButton isPending>Test</SubmitButton>);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByTestId("loader")).toBeVisible();
});

it("Should be disabled when isDirty property equals false and NOT display a loader.", () => {
  render(
    <SubmitButton isPending={false} isDirty={false}>
      Test
    </SubmitButton>,
  );
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.queryByTestId("loader")).toBeNull();
});
