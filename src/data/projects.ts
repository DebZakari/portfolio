export type ProjectSection =
  | { type: "context"; body: string }
  | { type: "approach"; body: string }
  | { type: "architecture"; body?: string; diagram?: string }
  | { type: "screenshots"; caption?: string; images: string[] };

export interface Project {
  title: string;
  slug: string;
  headline: string;
  desc: string;
  tech: string[];
  role: string;
  ai: boolean;
  outcome: string;
  inProgress: boolean;
  github: string | null;
  demo: string | null;
  images: string[];
  sections: ProjectSection[];
}

export const PROJECTS: Project[] = [
  {
    title: "NovelVerse",
    slug: "novelverse",
    headline: "An AI reading companion that knows every secret in the book, except the ones you haven't reached yet.",
    desc: "Turns static reading into a living ecosystem. Nova, the AI reading companion, uses Agentic Hybrid RAG (Knowledge Graph + semantic search) to let readers interrogate story lore, with Spoiler Guard built in. Authors get Git-like branch and PR workflows for collaborative editing and translations. Backed by a FastAPI microservice with LangGraph orchestration, vLLM inference, and a narration engine that voices stories aloud with expression inferred live from context, not scripted at authoring time.",
    tech: ["Next.js 16", "NestJS 11", "FastAPI", "LangGraph", "pgvector", "Neo4j", "vLLM", "Turborepo"],
    role: "Solo Developer / Founder",
    ai: true,
    outcome: "Spoiler-aware AI reading companion + Git-like collaborative authoring",
    inProgress: true,
    github: null,
    demo: null,
    images: [],
    sections: [
      {
        type: "context",
        body: "Reading fiction online is still a solitary, linear act. Readers cannot interrogate lore, trace character arcs, or ask why a name keeps appearing. Authors managing collaborative translations juggle files and email threads. Neither side has real tooling.",
      },
      {
        type: "approach",
        body: "Spoiler safety was the core design constraint. A naive RAG system retrieving from the full corpus would leak plot. The solution: a position-aware retrieval policy that locks semantic search to the reader's confirmed chapter boundary. Neo4j handles entity relationships and character graph traversal; pgvector handles semantic similarity. LangGraph orchestrates the compound query, choosing graph traversal versus embedding search per question type. The narration engine follows the same principle: expression is inferred, not scripted. An instruction LLM annotates each passage with inline emotion tags before synthesis, so a chase and a quiet farewell sound different without the author scripting either. Authors define a voice identity for their story; readers can override it.",
      },
      {
        type: "architecture",
        // TODO: set diagram path when file is available
        // diagram: "/assets/projects/novelverse-architecture.png",
      },
    ],
  },
  {
    title: "Enrollment V2",
    slug: "enrollment-v2",
    headline: "A form that doesn't punish applicants for having lives.",
    desc: "The original enrollment system was a single-page form: so long that users lost their place and gave up. The redesign breaks it into guided multi-step stages with progress saved to a generated code, no account required. Applicants leave and resume without starting over. Deployed in production for an academic institution and well-received.",
    tech: ["Laravel PHP", "MySQL", "Blade", "Tailwind CSS", "JavaScript", "SMTP"],
    role: "Full-Stack Developer",
    ai: false,
    outcome: "Multi-step enrollment with session-free progress saving; zero drop-off from form length",
    inProgress: false,
    github: null,
    demo: null,
    images: [],
    sections: [
      {
        type: "context",
        body: "The original enrollment system was a single-page scroll of fields, often 30 minutes to complete with no save state. Applicants who were interrupted had to start over. Drop-off was measurable and the institution knew it.",
      },
      {
        type: "approach",
        body: "The redesign breaks submission into guided stages with soft validation between each step, not a single submit wall at the end. A generated session code (no account required) lets applicants return days later to exactly where they stopped. Each stage validates only the fields visible on that screen, keeping error messages local and fixable rather than a scroll of failures. Deployed in production for an academic institution.",
      },
      {
        type: "screenshots",
        images: [],
      },
    ],
  },
  {
    title: "Iris Biometric Pipeline",
    slug: "iris-biometric",
    headline: "From labeled dataset to deployed API, start to finish.",
    desc: "Full lifecycle of a production biometric system: trained the iris detection (YOLO) and segmentation (UNet) models from scratch, then built the FastAPI microservice that serves the pipeline into an existing Laravel web application. One project, full stack, from dataset to deployed API.",
    tech: ["Python", "PyTorch", "YOLO", "UNet", "FastAPI", "Docker"],
    role: "ML / Backend Engineer",
    ai: true,
    outcome: "Iris pipeline trained and served to production; Laravel integration live",
    inProgress: false,
    github: null,
    demo: null,
    images: [],
    sections: [
      {
        type: "context",
        body: "The client needed iris recognition integrated into an existing Laravel web application. No off-the-shelf model existed for their iris dataset quality and capture conditions. The pipeline needed to be trained from their data and deployed as a latency-tolerant API.",
      },
      {
        type: "approach",
        body: "Two models were trained from scratch: YOLO for iris detection, locating the eye region in camera input; UNet for segmentation, isolating the iris from sclera and eyelid. The FastAPI microservice wraps both behind a single endpoint and returns a feature vector the Laravel application stores and compares. Docker handles environment parity between development and the production server.",
      },
    ],
  },
  {
    title: "PCB Vision System",
    slug: "pcb-vision",
    headline: "Edge AI built to run without a cloud dependency.",
    desc: "Client-commissioned edge AI system built end-to-end: trained a custom YOLOv8 model on their PCB dataset, designed the full AI-to-UI interaction flow, and built a lightweight Tkinter interface for a Raspberry Pi 4. Coral Edge TPU acceleration delivers real-time inference at 2-3x the speed of ncnn. Boots with a branded splash screen and auto-starts the detection pipeline.",
    tech: ["Python", "YOLOv8", "Tkinter", "Raspberry Pi 4", "Coral Edge TPU", "ONNX"],
    role: "IoT / CV Engineer",
    ai: true,
    outcome: "Real-time PCB inspection on edge hardware; 2-3x inference speedup via Coral TPU",
    inProgress: false,
    github: null,
    demo: null,
    images: [],
    sections: [
      {
        type: "context",
        body: "A client needed automated PCB defect detection at their assembly station. Requirements: real-time inference on modest hardware, fully offline-capable, boots to ready without manual setup.",
      },
      {
        type: "approach",
        body: "YOLOv8 was trained on their labeled PCB dataset. Two export paths were benchmarked: ncnn (the standard Raspberry Pi choice) and ONNX with Coral Edge TPU offload. The Coral path delivered 2-3x the throughput. Tkinter was chosen for the interface: lightweight, no browser dependency, no network stack. A systemd service auto-starts the detection pipeline on boot with a branded splash screen before the live feed. The whole experience is a sealed appliance.",
      },
    ],
  },
];
