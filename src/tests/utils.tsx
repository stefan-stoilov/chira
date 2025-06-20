import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { delay, type HttpHandler } from "msw";

export function networkDelay(delayTime = 500) {
  return delay(delayTime);
}

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>,
      ),
  };
}

export function QueryWrapper({
  children,
  queryClient,
}: React.PropsWithChildren & { queryClient?: QueryClient }) {
  const [testQueryClient] = useState(() => createTestQueryClient());
  return (
    <QueryClientProvider client={queryClient || testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

export function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

export function withMswHandlers(handlers: HttpHandler[]) {
  return {
    parameters: {
      msw: {
        handlers,
      },
    },
  };
}

export type GetMockIteratedDateProps = {
  /**
   * The numerical index used to calculate the date offset.
   * This typically comes from an array map function's index.
   */
  index: number;
  /**
   * The base timestamp string in the same format that `drizzle` timestamp is, `'YYYY-MM-DD HH:MM:SS.ms'`,
   * from which the new date will be calculated.
   */
  timestamp: string;
  /**
   * The type of operation to perform on the date.
   * - 'increment': Adds `index` days to the base timestamp (default).
   * - 'decrement': Subtracts `index` days from the base timestamp.
   * @default "increment"
   */
  type?: "increment" | "decrement";
};

/**
 * Generates a mock date string by incrementing or decrementing a base timestamp
 * by a specified number of days.
 *
 * This function is useful for creating mock data where dates need to be
 * sequential (e.g., for paginated results or chronological events).
 * It handles month and year rollovers automatically.
 *
 * @param {GetMockIteratedDateProps} props - The properties for date generation.
 * @returns {string} The formatted date string in 'YYYY-MM-DD HH:MM:SS.ms000' format.
 * @throws {Error} If an invalid timestamp string is provided.
 *
 * @example
 * // Incrementing dates
 * getMockIteratedDate({ index: 0, timestamp: '2024-04-11 14:14:28.038697' });
 * // Returns: "2024-04-11 14:14:28.038000"
 *
 * getMockIteratedDate({ index: 1, timestamp: '2024-04-11 14:14:28.038697' });
 * // Returns: "2024-04-12 14:14:28.038000"
 *
 * getMockIteratedDate({ index: 30, timestamp: '2024-04-11 14:14:28.038697' });
 * // Returns: "2024-05-11 14:14:28.038000" (handles month rollover)
 *
 * @example
 * // Decrementing dates
 * getMockIteratedDate({ index: 1, timestamp: '2024-04-11 14:14:28.038697', type: 'decrement' });
 * // Returns: "2024-04-10 14:14:28.038000"
 *
 * getMockIteratedDate({ index: 45, timestamp: '2024-04-11 14:14:28.038697', type: 'decrement' });
 * // Returns: "2024-02-26 14:14:28.038000" (handles month rollover)
 */
export function getMockIteratedDate({
  index,
  timestamp,
  type = "increment",
}: GetMockIteratedDateProps): string {
  const baseDate = new Date(timestamp);

  // Check if parsing was successful
  if (isNaN(baseDate.getTime()))
    throw new Error(
      "getMockIteratedDate should be provided with a valid timestamp",
    );

  const currentDate = new Date(baseDate.getTime());
  currentDate.setDate(
    currentDate.getDate() + (type === "increment" ? index : -index),
  );

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const milliseconds = currentDate
    .getMilliseconds()
    .toString()
    .padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000`;
}
