export type TimelineEntry = {
  date: string;
  name: string;
  type:
    | "Startup"
    | "Internship"
    | "Full-time"
    | "Freelance"
    | "Side Project"
    | "Hackathon"
    | "Project"
    | "Personal"
    | "Personal Project";
};

export type System = {
  title: string;
  stack: string[];
};

export type Domain = {
  label: string;
  pct: number;
};

export const TIMELINE: TimelineEntry[] = [
  { date: "Aug 2022", name: "EnyoumerateAI",            type: "Startup"          },
  { date: "Feb 2023", name: "meldCX",                   type: "Internship"       },
  { date: "Nov 2023", name: "Cerebrox IT Solutions",    type: "Full-time"        },
  { date: "Jan 2024", name: "Kanto Code",               type: "Freelance"        },
  { date: "Jun 2024", name: "AI Biometrics Pipeline",   type: "Side Project"     },
  { date: "Nov 2024", name: "PCB Components UI + AI",   type: "Side Project"     },
  { date: "Mar 2025", name: "FastAPI AI Microservice",  type: "Side Project"     },
  { date: "Apr 2025", name: "Innovate to Impact",       type: "Hackathon"        },
  { date: "Jul 2025", name: "Enrollment V2",            type: "Project"          },
  { date: "Mar 2026", name: "NovelVerse",               type: "Personal Project" },
  { date: "Apr 2026", name: "Updated Portfolio",        type: "Personal"         },
];

export const SYSTEMS: System[] = [
  {
    title: "NovelVerse",
    stack: ["Next.js", "NestJS", "FastAPI", "LangGraph", "vLLM", "pgvector", "Neo4j", "Redis", "Docker"],
  },
  {
    title: "Enrollment V2",
    stack: ["Laravel", "MySQL", "Tailwind CSS", "Alpine.js", "PHPUnit"],
  },
  {
    title: "Iris Biometrics Pipeline",
    stack: ["FastAPI", "PyTorch", "YOLO11", "UNet", "Python"],
  },
  {
    title: "PCB Components AI",
    stack: ["Python", "YOLOv8", "TFLite", "Raspberry Pi", "Coral Edge TPU"],
  },
  {
    title: "Cacao Defect Detection",
    stack: ["Python", "YOLOv8", "TFLite", "Raspberry Pi", "Coral Edge TPU"],
  },
  {
    title: "Face Recognition Pipeline",
    stack: ["Python", "TensorFlow", "RetinaFace", "ArcFace"],
  },
  {
    title: "Portfolio v1",
    stack: ["HTML", "CSS", "GitHub Pages"],
  },
  {
    title: "School Systems ×6",
    stack: ["CodeIgniter", "MySQL", "PHP", "Bootstrap", "jQuery", "Digital Ocean"],
  },
  {
    title: "IoT Attendance Devices ×6",
    stack: ["Node.js", "Raspberry Pi", "RFID", "MySQL", "Bash"],
  },
  {
    title: "GSM Notification System",
    stack: ["Python", "Raspberry Pi", "Bash"],
  },
  {
    title: "EnyoumerateAI",
    stack: ["Python", "YOLOv5", "PyTorch", "Tkinter", "C#"],
  },
  {
    title: "Web Testing Automation",
    stack: ["Python", "pytest", "Selenium"],
  },
  {
    title: "Portfolio v2",
    stack: ["Next.js", "TypeScript", "Canvas 2D", "Vercel"],
  },
];

export const DOMAINS: Domain[] = [
  { label: "Web / Full-Stack",              pct: 35 },
  { label: "AI / ML",                       pct: 30 },
  { label: "Computer Vision / Biometrics",  pct: 20 },
  { label: "IoT / Embedded",                pct: 15 },
];
