import { useEffect, useRef, useState } from "react";
import { profile, projects, skills, socials, channels } from "../data.js";

const USER = "vishwas@portfolio";

const STATUS_TEXT = { done: "done", "in-progress": "in progress", planned: "planned" };

const pad = (str, n) => str + " ".repeat(Math.max(1, n - str.length));

const COMMANDS = [
  ["whoami", "who I am"],
  ["ros2 node list", "sections of this site"],
  ["ros2 run vishwas projects", "what I've built"],
  ["ros2 topic echo /skills", "tools I use"],
  ["ros2 launch vishwas contact", "how to reach me"],
  ["resume", "open my resume"],
  ["clear", "clear the screen"],
];

const QUICK = ["whoami", "ros2 run vishwas projects", "ros2 topic echo /skills", "ros2 launch vishwas contact", "help"];

// Each command returns an array of lines. A line is a string, or
// { text, href } for a link.
function run(input) {
  const cmd = input.trim().replace(/\s+/g, " ").toLowerCase();

  switch (cmd) {
    case "":
      return [];
    case "help":
      return ["Available commands:", ...COMMANDS.map(([c, d]) => "  " + pad(c, 30) + d)];
    case "whoami":
      return [`${profile.name}. ${profile.role}.`, profile.intro, `Based in ${profile.location}.`];
    case "ros2 node list":
      return [
        { text: "/work", href: "#work" },
        { text: "/skills", href: "#skills" },
        { text: "/leadership", href: "#leadership" },
        { text: "/channels", href: "#channels" },
        { text: "/about", href: "#about" },
        { text: "/contact", href: "#contact" },
      ];
    case "projects":
    case "ros2 run vishwas projects":
      return [
        ...projects.map((p) => `${pad(p.name, 28)}${pad(STATUS_TEXT[p.status] || p.status, 14)}${p.stack.slice(0, 3).join(", ")}`),
        { text: "See the details in /work", href: "#work" },
      ];
    case "skills":
    case "ros2 topic echo /skills":
      return [...skills.map((g) => `${g.group.toLowerCase().replace(/ /g, "_")}: [${g.items.join(", ")}]`), "---"];
    case "contact":
    case "ros2 launch vishwas contact":
      return [
        "[INFO] [launch]: starting contact node",
        { text: `email: ${profile.email}`, href: `mailto:${profile.email}` },
        ...socials.map((s) => ({ text: `${s.label.toLowerCase()}: ${s.handle}`, href: s.url })),
        ...channels.map((c) => ({ text: `channel: ${c.handle}`, href: c.url })),
      ];
    case "resume":
      window.open(profile.resume, "_blank", "noopener");
      return ["Opening resume in a new tab."];
    case "ros2":
      return ["usage: ros2 <command>. Try: ros2 run vishwas projects"];
    case "sudo hire vishwas":
      return [
        "[sudo] password for recruiter: ********",
        "Access granted.",
        { text: `Send the offer to ${profile.email}`, href: `mailto:${profile.email}` },
      ];
    case "ls":
      return ["projects/  skills/  resume.pdf  contact.txt", "Tip: type help to see what you can run."];
    default:
      return [`${input.trim()}: command not found. Type help to see what's available.`];
  }
}

const WELCOME = ["Welcome. Type help and press Enter, or tap a command below."];

export default function Terminal() {
  const [lines, setLines] = useState(() => WELCOME.map((text) => ({ kind: "out", text })));
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const execute = (input) => {
    if (input.trim().toLowerCase() === "clear") {
      setLines([]);
    } else {
      const out = run(input).map((l) => (typeof l === "string" ? { kind: "out", text: l } : { kind: "link", ...l }));
      setLines((prev) => [...prev, { kind: "cmd", text: input }, ...out]);
    }
    if (input.trim()) setHistory((h) => [...h, input]);
    setCursor(-1);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      execute(value);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown" && cursor >= 0) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    }
  };

  const Prompt = () => (
    <span className="term__prompt">
      <span className="term__user">{USER}</span>:<span className="term__path">~</span>$
    </span>
  );

  return (
    <div className="term">
      <div className="term__titlebar">
        <span className="term__title">{USER}: ~</span>
        <span className="term__buttons" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="term__body" ref={bodyRef} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        <div aria-live="polite">
          {lines.map((l, i) =>
            l.kind === "cmd" ? (
              <div key={i} className="term__line">
                <Prompt /> {l.text}
              </div>
            ) : l.kind === "link" ? (
              <div key={i} className="term__line">
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.text}
                </a>
              </div>
            ) : (
              <div key={i} className="term__line">
                {l.text}
              </div>
            )
          )}
        </div>
        <label className="term__line term__input-row">
          <Prompt />
          <input
            ref={inputRef}
            className="term__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal command"
          />
        </label>
      </div>
      <div className="term__quick">
        {QUICK.map((c) => (
          <button key={c} type="button" onClick={() => execute(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
