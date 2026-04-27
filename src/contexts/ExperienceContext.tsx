"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  useState,
} from "react";

export type ExperienceMode = "immersive" | "focus";

const STORAGE_KEY = "experience-mode";

interface ExperienceContextValue {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
}

const ExperienceContext = createContext<ExperienceContextValue>({
  mode: "immersive",
  setMode: () => undefined,
});

function getServerSnapshot(): ExperienceMode {
  return "immersive";
}

function getClientSnapshot(): ExperienceMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "immersive" || stored === "focus") return stored;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return prefersReduced ? "focus" : "immersive";
}

const listeners = new Set<() => void>();

function subscribeToExperience(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function notifyListeners() {
  listeners.forEach((cb) => cb());
}

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const stored = useSyncExternalStore(
    subscribeToExperience,
    getClientSnapshot,
    getServerSnapshot
  );

  const [overrideMode, setOverrideMode] = useState<ExperienceMode | null>(null);
  const mode = overrideMode ?? stored;

  const setMode = useCallback((next: ExperienceMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setOverrideMode(next);
    notifyListeners();
  }, []);

  return (
    <ExperienceContext.Provider value={{ mode, setMode }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  return useContext(ExperienceContext);
}
