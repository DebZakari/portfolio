"use client";

import { useSyncExternalStore } from "react";

const MQ = "(max-width: 768px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MQ).matches,
    () => false
  );
}
