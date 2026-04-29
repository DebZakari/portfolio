export type LogEntry = {
  date: string;
  tag: string;
  title: string;
  excerpt: string;
};

export const LOGS: LogEntry[] = [
  {
    date: "2025·04",
    tag: "NovelVerse",
    title: "Building a Multi-Modal AI Reading Platform",
    excerpt:
      "Architecting a full-stack web novel platform with LangGraph agents, vLLM inference, RAG semantic search via pgvector, and SOTA TTS with voice cloning.",
  },
  {
    date: "2025·02",
    tag: "Speech AI",
    title: "Kokoro + Fish Speech: Local TTS Pipeline",
    excerpt:
      "Integrating ONNX Runtime TTS with Fish Speech S2 Pro for voice cloning. Latency optimization, audio caching via R2, and Redis-backed semantic caching.",
  },
  {
    date: "2024·12",
    tag: "Computer Vision",
    title: "Fine-Tuning YOLOv8 for PCB Detection",
    excerpt:
      "Training YOLOv8 on custom PCB datasets, optimizing for Coral Edge TPU deployment, and building a Tkinter UI for real-time manufacturing inspection.",
  },
  {
    date: "2024·09",
    tag: "Biometrics",
    title: "Iris Detection: YOLO + UNet Pipeline",
    excerpt:
      "End-to-end iris biometric system combining YOLO-based detection with UNet segmentation. PyTorch implementation with precision-focused post-processing.",
  },
];
