import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WorkspaceSwitcher } from "./workspace-switcher";

const push = vi.fn();
const open = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/features/workspaces/hooks/use-create-workspace-modal", () => ({
  useCreateWorkspaceModal: () => ({ open }),
}));

vi.mock("@/features/workspaces/hooks/use-workspace-id", () => ({
  useWorkspaceId: () => vi.fn().mockReturnValue(undefined),
}));

/**
 * JSDOM doesn't implement PointerEvent so we need to mock our own implementation
 * Default to mouse left click interaction
 * https://github.com/radix-ui/primitives/issues/1822
 * https://github.com/jsdom/jsdom/pull/2666
 */
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}

// @ts-expect-error: JSDOM doesn't implement PointerEvent so we need to mock our own implementation
window.PointerEvent = MockPointerEvent;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

const mockedDocuments = [
  {
    $id: "test1",
    name: "Test 1",
  },
  {
    $id: "test2",
    name: "Test 2",
  },
  {
    $id: "test3",
    name: "Test 3",
  },
];

function setUp() {
  render(<WorkspaceSwitcher />);
  const selectTrigger = screen.getByRole("combobox");

  return { selectTrigger };
}

describe("WorkspaceSwitcher test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(`Should render skeletons when data for workspaces is being fetched and they are undefined. 
       Loader should not be visible when workspaces are undefined.`, async () => {
    vi.mock("@/features/workspaces/api/use-workspaces", () => ({
      useWorkspaces: () =>
        vi.fn().mockReturnValue({ workspaces: undefined, isFetching: true }),
    }));

    const { selectTrigger } = setUp();

    fireEvent.pointerDown(
      selectTrigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      }),
    );

    waitFor(() => {
      expect(screen.findAllByTestId(/workspaces-skeleton/)).toHaveLength(3);
      expect(screen.queryByTestId(/workspaces-loader/)).toBeNull();
    });
  });

  it(`Should render loader when data for workspaces is defined and it is being re-fetched.
       Skeletons should not be visible when workspaces are defined.`, async () => {
    vi.mock("@/features/workspaces/api/use-workspaces", () => ({
      useWorkspaces: () =>
        vi.fn().mockReturnValue({
          workspaces: { total: 0, documents: [] },
          isFetching: true,
        }),
    }));

    const { selectTrigger } = setUp();

    fireEvent.pointerDown(
      selectTrigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      }),
    );

    waitFor(() => {
      expect(screen.getByTestId(/workspaces-loader/)).toBeDefined();
      expect(screen.queryAllByTestId(/workspaces-loader/)).toHaveLength(0);
    });
  });

  it(`Should render options when data for workspaces is defined and no skeletons and loader when data is not being re-fetched.`, async () => {
    vi.mock("@/features/workspaces/api/use-workspaces", () => ({
      useWorkspaces: () =>
        vi.fn().mockReturnValue({
          workspaces: {
            total: mockedDocuments.length,
            documents: mockedDocuments,
          },
          isFetching: false,
        }),
    }));

    const { selectTrigger } = setUp();

    fireEvent.pointerDown(
      selectTrigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      }),
    );

    waitFor(() => {
      expect(screen.queryAllByTestId(/workspaces-loader/)).toHaveLength(0);
      expect(screen.queryByTestId(/workspaces-loader/)).toBeNull();
    });
  });

  it(`Should render options when data for workspaces is defined.
       No skeletons should be present when data is being re-fetched, while loader should be present.
       Should call router.push() when an option is selected.`, async () => {
    vi.mock("@/features/workspaces/api/use-workspaces", () => ({
      useWorkspaces: () =>
        vi.fn().mockReturnValue({
          workspaces: {
            total: mockedDocuments.length,
            documents: mockedDocuments,
          },
          isFetching: false,
        }),
    }));

    const { selectTrigger } = setUp();

    fireEvent.pointerDown(
      selectTrigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      }),
    );

    waitFor(() => {
      expect(screen.queryAllByTestId(/workspaces-loader/)).toHaveLength(0);
      expect(screen.getByTestId(/workspaces-loader/)).toBeDefined();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(mockedDocuments.length);

      fireEvent.click(options[0]!);

      expect(push).toHaveBeenCalledOnce();
    });
  });
});
