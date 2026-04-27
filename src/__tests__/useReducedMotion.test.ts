import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function mockMatchMedia(initialMatches: boolean) {
  let currentMatches = initialMatches;
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mq = {
    get matches() { return currentMatches; },
    addEventListener: vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.push(cb);
    }),
    removeEventListener: vi.fn(),
    dispatchChange: (nextMatches: boolean) => {
      currentMatches = nextMatches;
      listeners.forEach((cb) => cb({ matches: nextMatches } as MediaQueryListEvent));
    },
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockReturnValue(mq),
  });
  return mq;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useReducedMotion", () => {
  it("returns false when prefers-reduced-motion does not match", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when prefers-reduced-motion matches", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when media query changes", async () => {
    const mq = mockMatchMedia(false);
    const { result, rerender } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    mq.dispatchChange(true);
    rerender();
    expect(result.current).toBe(true);
  });
});
