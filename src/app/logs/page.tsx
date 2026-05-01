import type { Metadata } from "next";
import LogsPageClient from "./LogsPageClient";

export const metadata: Metadata = {
  title: "Mission Logs | Dave Zachary Macarayo",
  description:
    "Development logs from Dave Zachary Macarayo: AI systems, computer vision, speech synthesis, and full-stack web engineering.",
};

export default function LogsPage() {
  return <LogsPageClient />;
}
