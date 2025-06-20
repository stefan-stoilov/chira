import { renderHook, act } from "@testing-library/react";
import { useMediaQuery, minWidth, maxWidth } from "./use-media-query";

const matchMediaMock = vi.fn();
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: matchMediaMock,
});

describe("useMediaQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false when media query does not match initially", () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() =>
      useMediaQuery({ type: "min", breakpoint: "md" }),
    );

    expect(matchMediaMock).toHaveBeenCalledWith(minWidth.md);
    expect(result.current).toBe(false);
  });

  it("should return true when media query matches initially", () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() =>
      useMediaQuery({ type: "max", breakpoint: "lg" }),
    );

    expect(matchMediaMock).toHaveBeenCalledWith(maxWidth.lg);
    expect(result.current).toBe(true);
  });

  it("should update state when the media query changes", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let changeListener: (event: { matches: boolean }) => void = () => {};

    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn((event, listener) => {
        if (event === "change") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          changeListener = listener;
        }
      }),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() =>
      useMediaQuery({ type: "min", breakpoint: "sm" }),
    );

    expect(result.current).toBe(false);

    act(() => {
      changeListener({ matches: true });
    });
    expect(result.current).toBe(true);

    act(() => {
      changeListener({ matches: false });
    });
    expect(result.current).toBe(false);
  });

  it("should clean up the event listener on unmount", () => {
    const removeEventListenerSpy = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
    });

    const { unmount } = renderHook(() =>
      useMediaQuery({ type: "min", breakpoint: "lg" }),
    );

    expect(removeEventListenerSpy).not.toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
