import "@testing-library/jest-dom/vitest";
import { server } from "@/tests/mocks/server";

beforeAll(() => {
  server.listen();
});

afterAll(() => server.close());

afterEach(() => {
  server.resetHandlers();
});
