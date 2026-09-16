import { useEffect, useRef, useState } from "react";

// A tiny top-down simulator in the style of RViz.
// The robot is a differential-drive base running a simple go-to-goal
// controller: turn toward the goal, drive, then turn to the goal heading.

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const COLORS = {
  bg: "#303033",
  grid: "rgba(160, 160, 164, 0.38)",
  path: "#3BE45B",
  goal: "#C18CFF",
  x: "#FF3B30",
  y: "#34D158",
  label: "#B9B9BE",
};

const DEMO_GOALS = [
  { x: 1.4, y: 0.9, th: Math.PI / 2 },
  { x: -1.3, y: 1.1, th: Math.PI },
  { x: -0.9, y: -1.0, th: -Math.PI / 2 },
  { x: 0, y: 0, th: 0 },
];

const DISPLAY_LABELS = { grid: "Grid", tf: "TF", path: "Path" };

export default function RobotViewport() {
  const canvasRef = useRef(null);
  const readoutRef = useRef(null);
  const [displays, setDisplays] = useState({ grid: true, tf: true, path: true });
  const displaysRef = useRef(displays);
  const sim = useRef({ x: 0, y: 0, th: 0, goal: null, drag: null, path: [], demo: true, demoIdx: 0, wait: 0 });
  const boundsRef = useRef({ x: 2, y: 2 });

  useEffect(() => {
    displaysRef.current = displays;
  }, [displays]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = sim.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) s.demo = false;
    else s.goal = { ...DEMO_GOALS[0] };

    let w = 0, h = 0, dpr = 1, scale = 80;
    let raf = 0, last = performance.now(), visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      scale = Math.min(w, h) / 4.2; // pixels per metre
      boundsRef.current = { x: w / 2 / scale - 0.35, y: h / 2 / scale - 0.35 };
      draw();
    };

    const toWorld = (px, py) => ({ x: (px - w / 2) / scale, y: -(py - h / 2) / scale });
    const toScreen = (x, y) => [w / 2 + x * scale, h / 2 - y * scale];

    const step = (dt) => {
      if (s.wait > 0) {
        s.wait -= dt;
        if (s.wait <= 0 && s.demo) {
          s.demoIdx = (s.demoIdx + 1) % DEMO_GOALS.length;
          s.goal = { ...DEMO_GOALS[s.demoIdx] };
        }
        return;
      }
      const g = s.goal;
      if (!g || g.reached) return;

      const dx = g.x - s.x, dy = g.y - s.y;
      const rho = Math.hypot(dx, dy);
      let v = 0, omega = 0;

      if (rho > 0.04) {
        const alpha = wrap(Math.atan2(dy, dx) - s.th);
        omega = clamp(3.2 * alpha, -2.4, 2.4);
        v = Math.abs(alpha) > 0.9 ? 0 : clamp(1.3 * rho, 0.08, 0.9) * Math.cos(alpha);
      } else if (g.th != null && Math.abs(wrap(g.th - s.th)) > 0.02) {
        omega = clamp(3.2 * wrap(g.th - s.th), -2.4, 2.4);
      } else {
        g.reached = true;
        if (s.demo) s.wait = 0.7;
        return;
      }

      s.th = wrap(s.th + omega * dt);
      s.x += v * Math.cos(s.th) * dt;
      s.y += v * Math.sin(s.th) * dt;

      const p = s.path[s.path.length - 1];
      if (!p || Math.hypot(p.x - s.x, p.y - s.y) > 0.02) {
        s.path.push({ x: s.x, y: s.y });
        if (s.path.length > 700) s.path.shift();
      }
    };

    const arrow = (x, y, th, len, color, width) => {
      const [sx, sy] = toScreen(x, y);
      const ex = sx + Math.cos(th) * len * scale;
      const ey = sy - Math.sin(th) * len * scale;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      const head = Math.max(7, width * 2.6);
      const a = Math.atan2(ey - sy, ex - sx);
      ctx.beginPath();
      ctx.moveTo(ex + Math.cos(a) * head * 0.4, ey + Math.sin(a) * head * 0.4);
      ctx.lineTo(ex - Math.cos(a - 0.5) * head, ey - Math.sin(a - 0.5) * head);
      ctx.lineTo(ex - Math.cos(a + 0.5) * head, ey - Math.sin(a + 0.5) * head);
      ctx.closePath();
      ctx.fill();
    };

    const frame = (x, y, th, len, label, offset = 8) => {
      arrow(x, y, th, len, COLORS.x, 3);
      arrow(x, y, th + Math.PI / 2, len, COLORS.y, 3);
      const [sx, sy] = toScreen(x, y);
      ctx.fillStyle = COLORS.label;
      ctx.font = "500 11px 'IBM Plex Mono', monospace";
      ctx.fillText(label, sx + offset, sy + offset + 8);
    };

    const draw = () => {
      if (!w) return;
      const d = displaysRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);

      if (d.grid) {
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const half = { x: w / 2 / scale, y: h / 2 / scale };
        for (let gx = -Math.ceil(half.x); gx <= Math.ceil(half.x); gx++) {
          const [px] = toScreen(gx, 0);
          ctx.moveTo(Math.round(px) + 0.5, 0);
          ctx.lineTo(Math.round(px) + 0.5, h);
        }
        for (let gy = -Math.ceil(half.y); gy <= Math.ceil(half.y); gy++) {
          const [, py] = toScreen(0, gy);
          ctx.moveTo(0, Math.round(py) + 0.5);
          ctx.lineTo(w, Math.round(py) + 0.5);
        }
        ctx.stroke();
      }

      if (d.path && s.path.length > 1) {
        ctx.strokeStyle = COLORS.path;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.beginPath();
        s.path.forEach((p, i) => {
          const [px, py] = toScreen(p.x, p.y);
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.stroke();
      }

      if (d.tf) frame(0, 0, 0, 0.5, "odom");

      // goal (or goal being dragged)
      const g = s.drag || s.goal;
      if (g) {
        const [gx, gy] = toScreen(g.x, g.y);
        ctx.globalAlpha = g.reached ? 0.45 : 1;
        ctx.strokeStyle = COLORS.goal;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(gx, gy, 7, 0, Math.PI * 2);
        ctx.stroke();
        if (g.th != null) arrow(g.x, g.y, g.th, 0.5, COLORS.goal, 3);
        ctx.globalAlpha = 1;
      }

      // robot body, drawn in metres with y pointing up
      const [rx, ry] = toScreen(s.x, s.y);
      ctx.save();
      ctx.translate(rx, ry);
      ctx.scale(scale, -scale);
      ctx.rotate(s.th);
      ctx.lineWidth = 1.5 / scale;
      ctx.fillStyle = "#111";
      ctx.fillRect(-0.09, 0.165, 0.18, 0.06);
      ctx.fillRect(-0.09, -0.225, 0.18, 0.06);
      ctx.fillStyle = "#D9D9DC";
      ctx.strokeStyle = "#111";
      ctx.beginPath();
      ctx.rect(-0.22, -0.165, 0.44, 0.33);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#2A2A2E";
      ctx.beginPath();
      ctx.arc(0.07, 0, 0.075, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.arc(-0.16, 0, 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (d.tf) frame(s.x, s.y, s.th, 0.38, "base_link", 0.22 * scale);

      if (readoutRef.current) {
        const deg = Math.round((s.th * 180) / Math.PI);
        readoutRef.current.textContent = `x ${s.x.toFixed(2)}  y ${s.y.toFixed(2)}  θ ${deg}°`;
      }
    };

    const loop = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (visible) {
        step(dt);
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    // pointer: press to place the goal, drag to set heading
    const pointerPos = (e) => {
      const r = canvas.getBoundingClientRect();
      return toWorld(e.clientX - r.left, e.clientY - r.top);
    };
    const clampToView = (p) => ({
      x: clamp(p.x, -boundsRef.current.x, boundsRef.current.x),
      y: clamp(p.y, -boundsRef.current.y, boundsRef.current.y),
    });
    const onDown = (e) => {
      if (e.button !== 0) return;
      const p = clampToView(pointerPos(e));
      s.drag = { ...p, th: null };
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!s.drag) return;
      const p = pointerPos(e);
      const dx = p.x - s.drag.x, dy = p.y - s.drag.y;
      s.drag.th = Math.hypot(dx, dy) > 0.12 ? Math.atan2(dy, dx) : null;
    };
    const onUp = () => {
      if (!s.drag) return;
      s.goal = { ...s.drag };
      s.drag = null;
      s.demo = false;
      s.wait = 0;
    };
    const onCancel = () => { s.drag = null; };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onCancel);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
    };
  }, []);

  // keyboard teleop: arrow keys nudge the goal
  const onKeyDown = (e) => {
    const s = sim.current;
    const b = boundsRef.current;
    const base = { x: s.x, y: s.y, th: s.th };
    let goal = null;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const dir = e.key === "ArrowUp" ? 1 : -1;
      goal = { x: base.x + dir * 0.6 * Math.cos(base.th), y: base.y + dir * 0.6 * Math.sin(base.th), th: base.th };
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      goal = { x: base.x, y: base.y, th: wrap(base.th + (e.key === "ArrowLeft" ? 1 : -1) * (Math.PI / 4)) };
    }
    if (!goal) return;
    e.preventDefault();
    goal.x = clamp(goal.x, -b.x, b.x);
    goal.y = clamp(goal.y, -b.y, b.y);
    s.goal = goal;
    s.demo = false;
    s.wait = 0;
  };

  const reset = () => {
    Object.assign(sim.current, { x: 0, y: 0, th: 0, goal: null, drag: null, path: [], demo: false, wait: 0 });
  };

  return (
    <figure className="viewport">
      <div className="viewport__bar">
        <fieldset className="viewport__displays">
          <legend>Displays</legend>
          {Object.keys(DISPLAY_LABELS).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={displays[key]}
                onChange={(e) => setDisplays((d) => ({ ...d, [key]: e.target.checked }))}
              />
              {DISPLAY_LABELS[key]}
            </label>
          ))}
        </fieldset>
        <button type="button" className="viewport__reset" onClick={reset}>
          Reset
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="viewport__canvas"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Simulated robot. Click to send it a goal, or focus here and use the arrow keys to drive."
      />
      <figcaption className="viewport__status">
        <span>Click to send the robot a goal. Drag to set its heading.</span>
        <span ref={readoutRef} className="viewport__readout" aria-hidden="true" />
      </figcaption>
    </figure>
  );
}
