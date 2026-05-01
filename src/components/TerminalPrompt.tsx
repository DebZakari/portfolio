"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LOGS } from "@/data/logs";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

type OutputLine = {
  text: string;
  desc?: string;
  col?: string;
  dim?: boolean;
  bright?: boolean;
  href?: string;
  pre?: boolean;
  left?: string;
};

type HistoryEntry = {
  cmd: string;
  output: OutputLine[];
};

type ExecResult = OutputLine[] | "navigate" | "clear";

function execute(cmd: string): ExecResult {
  const t = cmd.trim();
  if (!t) return [];

  switch (t) {
    case "help":
      return [
        { text: "available commands:", dim: true },
        { text: " " },
        { text: "  cat logs/mission.log", desc: "dump all entries" },
        { text: "  less logs/mission.log", desc: "open full archive" },
        { text: "  ls", desc: "list sections" },
        { text: "  whoami", desc: "about dave" },
        { text: "  git log --oneline", desc: "project timeline" },
        { text: "  ping dave", desc: "contact info" },
        { text: "  sudo hire dave", desc: ";)" },
        { text: "  neofetch", desc: "system info" },
        { text: "  clear", desc: "clear terminal" },
      ];

    case "cat logs/mission.log":
      return LOGS.flatMap((log) => [
        { text: `[${log.date}] ${log.tag}`, dim: true },
        { text: log.title, bright: true },
        { text: log.excerpt },
        { text: " " },
      ]);

    case "less logs/mission.log":
    case "cat logs/mission.log | less":
      return "navigate";

    case "ls":
    case "ls -la":
    case "ls /": {
      const sections = ["hero", "skills", "projects", "logs", "contact"];
      return sections.map((s) => ({ text: `drwxr-xr-x  ${s}/`, dim: true }));
    }

    case "whoami":
      return [
        { text: "dave zachary macarayo", bright: true },
        { text: "web developer · computer engineering graduate", dim: true },
        { text: "ai: llms · rag · tts · biometrics · computer vision", dim: true },
      ];

    case "git log --oneline":
    case "git log":
      return LOGS.map((log, i) => ({
        text: `${log.date}  ${log.title}`,
        dim: i > 0,
      }));

    case "ping dave":
      return [
        { text: "PING dave (1 packet transmitted)" },
        { text: " " },
        { text: "  email    mdavezachary@gmail.com", href: "mailto:mdavezachary@gmail.com" },
        { text: "  github   github.com/DebZakari", href: "https://github.com/DebZakari" },
        { text: " " },
        { text: "1 received, 0% packet loss", dim: true },
      ];

    case "sudo hire dave":
    case "sudo hire-dave":
      return [
        { text: "[sudo] password for visitor: ••••••••", dim: true },
        { text: " " },
        { text: "Permission granted.", bright: true },
        { text: "mdavezachary@gmail.com", href: "mailto:mdavezachary@gmail.com" },
      ];

    case "neofetch": {
      const W = 76;
      const ART = [
        "                           ..:;+xXX$$$$$XXx+;:..",
        "                       ..;x&&&&&&&&&&&&&&&&&&&&&X;..",
        "                      ;&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X:",
        "                   .x&&&&&&&&&&$x;:::::::;xX&&&&&&&&&&&$X+:.        ..;;;.",
        "                  ;$&&&&&&&$+:. .::.....::. .:+X&&&&&&&&&&&&&&&&&$X+;:..",
        "                 +&&&&&&&$;. .:..         ..:.  .+$&&&&&&&&$Xx+:.",
        "                +&&&&&&&x  .:.             ..:++X$&&&$Xx+:.",
        "               :&&&&&&&x  .:        ....;x$&&&&&$x;.",
        "               $&&&&&&&.  ;     .:+X&&&&&&x;....",
        "             .X&&&&&&&x .:xx$$&&&&$x+::..      .: :&&&$$x",
        "            :$&&&&&&&&&&&&&$x+;:..            .;  +&&&&&&:",
        "         .:X&&&&&&&$$Xx+:.   .               .:. :&&&&&&X",
        "      .:x&&&$XX+;:.      .::..:...       ...:. .;&&&&&&$.",
        " ...+X$x;:             .;$&&&;.. .:::::::.  ..+&&&&&&&$.",
        "......                 ;&&&&&&&&X+:.    .:+$&&&&&&&&&:.",
        "                       .;X&&&&&&&&&&&&&&&&&&&&&&&&X:.",
        "                          .;+X&&&&&&&&&&&&&&&&X+:.",
        "                               .:;++xxxx++;:.",
      ];
      const INFO: OutputLine[] = [
        { text: "dave@portfolio", bright: true },
        { text: "──────────────", dim: true },
        { text: "  OS",      desc: "Next.js 15 + React 19",      col: "12ch" },
        { text: "  Runtime", desc: "Vercel Edge",                col: "12ch" },
        { text: "  Shell",   desc: "TypeScript 5",               col: "12ch" },
        { text: "  AI",      desc: "LangGraph · vLLM · PyTorch", col: "12ch" },
        { text: "  DB",      desc: "PostgreSQL · Neo4j · Redis",  col: "12ch" },
        { text: "  Uptime",  desc: "building since 2021",        col: "12ch" },
      ];
      return ART.map((artLine, i) => ({
        ...(INFO[i] ?? { text: "" }),
        left: artLine.padEnd(W),
      }));
    }

    case "clear":
      return "clear";

    default:
      return [
        { text: `bash: ${t}: command not found`, dim: true },
        { text: "type 'help' for available commands", dim: true },
      ];
  }
}

function OutputLine({ line }: { line: OutputLine }) {
  const base: React.CSSProperties = {
    ...MONO,
    fontSize: 11,
    letterSpacing: "0.04em",
    lineHeight: 1.65,
  };

  const content = line.href ? (
    <a
      href={line.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
    >
      {line.text}
    </a>
  ) : (
    line.text
  );

  if (line.left !== undefined) {
    const right = line.desc !== undefined ? (
      <>
        <span style={{ color: "var(--text-muted)", flex: `0 0 ${line.col ?? "12ch"}` }}>{line.text}</span>
        <span style={{ color: "var(--text-dim)" }}>{line.desc}</span>
      </>
    ) : (
      <span style={{ color: line.bright ? "var(--text)" : line.dim ? "var(--text-dim)" : "var(--text-muted)" }}>
        {line.text}
      </span>
    );
    return (
      <div style={{ ...base, display: "flex", whiteSpace: "pre" }}>
        <span style={{ color: "var(--text)", flexShrink: 0 }}>{line.left}</span>
        {right}
      </div>
    );
  }

  if (line.desc !== undefined) {
    return (
      <div style={{ ...base, display: "flex" }}>
        <span style={{ color: "var(--text-muted)", flex: `0 0 ${line.col ?? "26ch"}` }}>{line.text}</span>
        <span style={{ color: "var(--text-dim)" }}>{line.desc}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...base,
        color: line.bright
          ? "var(--text)"
          : line.dim
          ? "var(--text-dim)"
          : "var(--text-muted)",
        ...(line.pre ? { whiteSpace: "pre" } : {}),
      }}
    >
      {content}
    </div>
  );
}

export default function TerminalPrompt() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cursorPos, setCursorPos] = useState(0);
  const [focused, setFocused] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const blinkRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const stopBlink = useCallback(() => {
    if (blinkRef.current) { clearInterval(blinkRef.current); blinkRef.current = null; }
    setCursorOn(true);
  }, []);

  const startBlink = useCallback(() => {
    if (blinkRef.current) return;
    blinkRef.current = setInterval(() => setCursorOn((v) => !v), 550);
  }, []);

  const resetIdleTimer = useCallback(() => {
    stopBlink();
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(startBlink, 1250);
  }, [stopBlink, startBlink]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(coarse || "ontouchstart" in window);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    return () => {
      if (blinkRef.current) clearInterval(blinkRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const syncCursor = useCallback(() => {
    setCursorPos(inputRef.current?.selectionStart ?? 0);
  }, []);

  const submit = useCallback(() => {
    const result = execute(input);

    if (result === "navigate") {
      router.push("/logs");
      return;
    }

    if (result === "clear") {
      setHistory([]);
      setCmdHistory((prev) => [input, ...prev]);
      setHistoryIdx(-1);
      setInput("");
      setCursorPos(0);
      return;
    }

    if (input.trim()) {
      setHistory((prev) => [...prev, { cmd: input, output: result }]);
      setCmdHistory((prev) => [input, ...prev]);
    }

    setHistoryIdx(-1);
    setInput("");
    setCursorPos(0);
  }, [input, router]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key === "Escape") {
        inputRef.current?.blur();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
        const cmd = cmdHistory[next] ?? "";
        setHistoryIdx(next);
        setInput(cmd);
        setCursorPos(cmd.length);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = historyIdx - 1;
        if (next < 0) {
          setHistoryIdx(-1);
          setInput("");
          setCursorPos(0);
        } else {
          const cmd = cmdHistory[next] ?? "";
          setHistoryIdx(next);
          setInput(cmd);
          setCursorPos(cmd.length);
        }
      }
    },
    [submit, historyIdx, cmdHistory]
  );

  const focus = useCallback(() => {
    if (!isMobile) inputRef.current?.focus();
  }, [isMobile]);

  if (isMobile) {
    return (
      <a
        href="/logs"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 20px",
          background: "var(--surface2)",
          borderTop: "1px solid var(--border)",
          textDecoration: "none",
        }}
      >
        <span style={{ ...MONO, fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
          <span style={{ marginRight: 6 }}>$</span>
          cat logs/mission.log
        </span>
        <span style={{ ...MONO, fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
          {LOGS.length} entries →
        </span>
      </a>
    );
  }

  return (
    <>
      {history.length > 0 && (
        <div
          ref={outputRef}
          style={{
            maxHeight: 220,
            overflowY: "auto",
            overflowX: "auto",
            background: "var(--bg)",
            borderTop: "1px solid var(--border)",
            padding: "12px 20px",
          }}
        >
          {history.map((entry, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div
                style={{
                  ...MONO,
                  fontSize: 11,
                  color: "var(--text-dim)",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                <span style={{ marginRight: 6, opacity: 0.4 }}>$</span>
                {entry.cmd}
              </div>
              {entry.output.map((line, j) => (
                <OutputLine key={j} line={line} />
              ))}
            </div>
          ))}
        </div>
      )}

      <div
        onClick={focus}
        aria-hidden="true"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "11px 20px",
          background: "var(--surface2)",
          borderTop: `1px solid ${focused ? "var(--accent2)" : "var(--border)"}`,
          transition: "border-top-color 0.2s",
          cursor: "text",
          userSelect: "none",
        }}
      >
        <span
          style={{
            ...MONO,
            fontSize: 11,
            color: "var(--text-dim)",
            letterSpacing: "0.06em",
            marginRight: 6,
          }}
        >
          $
        </span>
        <span
          style={{
            ...MONO,
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
          }}
        >
          {input.slice(0, cursorPos)}
        </span>
        <span
          aria-hidden="true"
          style={{
            ...MONO,
            fontSize: 11,
            letterSpacing: "0.06em",
            display: "inline-block",
            minWidth: "0.6em",
            height: "1.2em",
            lineHeight: "1.2em",
            backgroundColor: cursorOn ? "var(--text-muted)" : "transparent",
            color: cursorOn ? "var(--surface2)" : "var(--text-muted)",
            opacity: focused ? 1 : 0.5,
          }}
        >
          {input[cursorPos] ?? " "}
        </span>
        <span
          style={{
            ...MONO,
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
          }}
        >
          {input.slice(cursorPos + 1)}
        </span>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCursorPos(e.target.selectionStart ?? e.target.value.length);
            resetIdleTimer();
          }}
          onSelect={syncCursor}
          onKeyDown={(e) => { handleKey(e); resetIdleTimer(); }}
          onFocus={() => { setFocused(true); startBlink(); }}
          onBlur={() => {
            setFocused(false);
            stopBlink();
            if (idleRef.current) { clearTimeout(idleRef.current); idleRef.current = null; }
          }}
          aria-label="Terminal command input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />
      </div>
    </>
  );
}
