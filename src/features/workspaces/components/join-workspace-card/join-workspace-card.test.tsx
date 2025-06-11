import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { handlers } from "../../api/use-join-workspace/mocks";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { JoinWorkspaceCard } from "./join-workspace-card";
import {
  INVITE_LINK_SEARCH_PARAMS,
  INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES,
} from "../../hooks/use-join-search-params";
import {
  INVALID_INVITE_LINK_SEARCH_PARAMS,
  VALID_INVITE_LINK_SEARCH_PARAMS,
} from "../../hooks/use-join-search-params/mocks";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

function setup() {
  render(
    <NuqsTestingAdapter searchParams={VALID_INVITE_LINK_SEARCH_PARAMS}>
      <QueryWrapper>
        <JoinWorkspaceCard />
      </QueryWrapper>
    </NuqsTestingAdapter>,
  );

  const toastErrorSpy = vi.spyOn(toast, "error");
  const toastSuccessSpy = vi.spyOn(toast, "success");

  const button = screen.getByRole("button");
  const input = screen.getByLabelText("Invite code");
  expect(input).toBeDisabled();
  expect(input).toHaveValue(VALID_INVITE_LINK_SEARCH_PARAMS.code);

  return { button, input, toastErrorSpy, toastSuccessSpy };
}

describe("Join workspace card test", () => {
  describe("Search params validation", () => {
    it("Should display 'not provided' error messages when neither of the required search params are present.", () => {
      render(
        <NuqsTestingAdapter>
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(2);
      Object.values(INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES).forEach(
        (message) => {
          expect(screen.getByText(message.notProvided)).toBeVisible();
        },
      );
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
    });

    it("Should display 'not provided' error message only for code when not provided while id matches schema.", () => {
      render(
        <NuqsTestingAdapter
          searchParams={{
            [INVITE_LINK_SEARCH_PARAMS.id]: VALID_INVITE_LINK_SEARCH_PARAMS.id,
          }}
        >
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(1);
      expect(
        screen.getByText(
          INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.notProvided,
        ),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
    });

    it("Should display 'not provided' error message only for id when not provided while code matches schema.", () => {
      render(
        <NuqsTestingAdapter
          searchParams={{
            [INVITE_LINK_SEARCH_PARAMS.code]:
              VALID_INVITE_LINK_SEARCH_PARAMS.code,
          }}
        >
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(1);
      expect(
        screen.getByText(
          INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.notProvided,
        ),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
    });

    it("Should display 'invalid' error messages when both of the required search params are present but do not match schema.", () => {
      render(
        <NuqsTestingAdapter searchParams={INVALID_INVITE_LINK_SEARCH_PARAMS}>
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(2);
      Object.values(INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES).forEach(
        (message) => {
          expect(screen.getByText(message.invalid)).toBeVisible();
        },
      );
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
    });

    it("Should display 'invalid' error message only for code when only code does not match schema.", () => {
      render(
        <NuqsTestingAdapter
          searchParams={{
            [INVITE_LINK_SEARCH_PARAMS.id]: VALID_INVITE_LINK_SEARCH_PARAMS.id,
            [INVITE_LINK_SEARCH_PARAMS.code]:
              INVALID_INVITE_LINK_SEARCH_PARAMS.code,
          }}
        >
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(1);
      expect(
        screen.getByText(INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.invalid),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
    });

    it("Should display 'invalid' error message only for id when only id does not match schema.", () => {
      render(
        <NuqsTestingAdapter
          searchParams={{
            [INVITE_LINK_SEARCH_PARAMS.code]:
              VALID_INVITE_LINK_SEARCH_PARAMS.code,
            [INVITE_LINK_SEARCH_PARAMS.id]:
              INVALID_INVITE_LINK_SEARCH_PARAMS.id,
          }}
        >
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(1);
      expect(
        screen.getByText(INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.invalid),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
    });

    it("Should not display any error messages when both of the required search params are present and match schema.", () => {
      render(
        <NuqsTestingAdapter searchParams={VALID_INVITE_LINK_SEARCH_PARAMS}>
          <QueryWrapper>
            <JoinWorkspaceCard />
          </QueryWrapper>
        </NuqsTestingAdapter>,
      );

      const list = screen.queryByRole("list");
      expect(list).toBeNull();
      Object.values(INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES).forEach(
        (message) => {
          expect(screen.queryByText(message.invalid)).toBeNull();
          expect(screen.queryByText(message.notProvided)).toBeNull();
        },
      );
      expect(
        screen.queryByRole("button", { name: /back to dashboard/i }),
      ).toBeNull();
    });
  });

  describe("With valid search params", () => {
    it("Should display a loader when waiting for server to respond.", async () => {
      server.use(handlers.loading);
      const { button } = setup();

      const user = userEvent.setup();
      await user.click(button);

      expect(await screen.findByTestId("loader")).toBeVisible();
      expect(button).toBeVisible();
    });

    it("Should display error message when server responds with error.", async () => {
      server.use(handlers.errorNotFound);
      const { button, toastErrorSpy } = setup();

      const user = userEvent.setup();
      await user.click(button);

      expect(await screen.findByTestId("error-message")).toBeVisible();
      expect(button).not.toBeVisible();
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
      expect(toastErrorSpy).toHaveBeenCalled();
    });

    it("Should display success message when server responds with success.", async () => {
      server.use(handlers.success);
      const { button, toastSuccessSpy } = setup();

      const user = userEvent.setup();
      await user.click(button);

      expect(await screen.findByTestId("success-message")).toBeVisible();
      expect(button).not.toBeVisible();
      expect(
        screen.getByRole("button", { name: /back to dashboard/i }),
      ).toBeVisible();
      expect(toastSuccessSpy).toHaveBeenCalled();
    });
  });
});
