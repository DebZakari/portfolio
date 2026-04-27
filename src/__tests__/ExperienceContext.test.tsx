import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExperienceProvider, useExperience } from "@/contexts/ExperienceContext";

// ── helpers ────────────────────────────────────────────────────────

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

function mockLocalStorage(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    store,
  };
}

function TestConsumer() {
  const { mode, setMode } = useExperience();
  return (
    <>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => setMode("immersive")}>set-immersive</button>
      <button onClick={() => setMode("focus")}>set-focus</button>
    </>
  );
}

function renderWithProvider() {
  return render(
    <ExperienceProvider>
      <TestConsumer />
    </ExperienceProvider>
  );
}

// ── tests ──────────────────────────────────────────────────────────

beforeEach(() => {
  vi.restoreAllMocks();
  mockMatchMedia(false);
  const ls = mockLocalStorage();
  Object.defineProperty(window, "localStorage", { writable: true, value: ls });
});

describe("ExperienceContext — default mode", () => {
  it("defaults to immersive when no localStorage and no reduced-motion", () => {
    renderWithProvider();
    expect(screen.getByTestId("mode").textContent).toBe("immersive");
  });

  it("defaults to focus when prefers-reduced-motion and no localStorage value", () => {
    mockMatchMedia(true);
    renderWithProvider();
    expect(screen.getByTestId("mode").textContent).toBe("focus");
  });
});

describe("ExperienceContext — localStorage precedence", () => {
  it("uses stored 'focus' over reduced-motion=false default", () => {
    const ls = mockLocalStorage({ "experience-mode": "focus" });
    Object.defineProperty(window, "localStorage", { writable: true, value: ls });
    renderWithProvider();
    expect(screen.getByTestId("mode").textContent).toBe("focus");
  });

  it("uses stored 'immersive' even when reduced-motion=true", () => {
    mockMatchMedia(true);
    const ls = mockLocalStorage({ "experience-mode": "immersive" });
    Object.defineProperty(window, "localStorage", { writable: true, value: ls });
    renderWithProvider();
    expect(screen.getByTestId("mode").textContent).toBe("immersive");
  });
});

describe("ExperienceContext — setMode", () => {
  it("updates mode in state", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    expect(screen.getByTestId("mode").textContent).toBe("immersive");
    await user.click(screen.getByText("set-focus"));
    expect(screen.getByTestId("mode").textContent).toBe("focus");
  });

  it("writes new mode to localStorage", async () => {
    const user = userEvent.setup();
    const ls = mockLocalStorage();
    Object.defineProperty(window, "localStorage", { writable: true, value: ls });
    renderWithProvider();
    await user.click(screen.getByText("set-focus"));
    expect(ls.setItem).toHaveBeenCalledWith("experience-mode", "focus");
  });

  it("switching back to immersive updates state and storage", async () => {
    const user = userEvent.setup();
    const ls = mockLocalStorage({ "experience-mode": "focus" });
    Object.defineProperty(window, "localStorage", { writable: true, value: ls });
    renderWithProvider();
    await act(async () => {
      await user.click(screen.getByText("set-immersive"));
    });
    expect(screen.getByTestId("mode").textContent).toBe("immersive");
    expect(ls.setItem).toHaveBeenCalledWith("experience-mode", "immersive");
  });
});
