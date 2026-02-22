import getNextColor, { resetPalette } from "../js/colors.js";
import attractors from "../js/attractors.js";

// ── DOM ──
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const panel = document.getElementById("panel");
const panelToggle = document.getElementById("panelToggle");
const attractorLabel = document.getElementById("attractorLabel");
const fpsCounter = document.getElementById("fpsCounter");

// ── THEME SYSTEM ──
const THEMES = ["terminal", "dracula", "nord", "solarized", "paper"];
let trailColor = "rgba(10, 15, 10, 0.18)";

function hexToRgba(hex, alpha) {
  hex = hex.trim();
  if (!hex.startsWith("#")) return `rgba(0, 0, 0, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateTrailColor() {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue("--void")
    .trim();
  trailColor = hexToRgba(hex, 0.18);
}

function setTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  localStorage.setItem("chaos-theme", name);
  document.querySelectorAll(".theme-swatch").forEach((s) => {
    s.classList.toggle("active", s.dataset.theme === name);
  });
  requestAnimationFrame(updateTrailColor);
}

// Init from localStorage
const savedTheme = localStorage.getItem("chaos-theme") || "terminal";
setTheme(savedTheme);

// Swatch clicks
document.getElementById("themeSwatches").addEventListener("click", (e) => {
  const swatch = e.target.closest(".theme-swatch");
  if (swatch) setTheme(swatch.dataset.theme);
});

// ── CONSTS ──
const dt = 0.01;
const scale_factor = () => Math.min(canvas.width, canvas.height) / 2 - 10;

let q = 0;
let a = canvas.width / 7;
let b = canvas.width / 6;
let c = canvas.width / 2;

// ── SIZING ──
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  a = canvas.width / 7;
  b = canvas.width / 6;
  c = canvas.width / 2;
}
resize();
window.addEventListener("resize", resize, false);

let paths = [];
let colors = [];
let chosenAttractorFunction = attractors[0];
let chosenIndex = 0;

// ── ATTRACTOR NAMES (for display label) ──
const attractorNames = [
  "LORENZ",
  "HALVORSEN",
  "THREE CELLS CNN",
  "NEWTON–LEIPNIK",
  "AIZAWA",
  "ARNEODO",
  "BURKE–SHAW",
  "FINANCE",
  "RUCKLIDGE",
  "SPROTT–LINZ A",
  "SPROTT–LINZ E",
  "SPROTT–LINZ J",
  "SPROTT–LINZ L",
  "SPROTT–LINZ R",
  "SPROTT–LINZ S",
  "THOMAS",
  "YU WANG",
  "ZHOU CHEN",
  "MULTI SPROTT C",
];

// ── PANEL TOGGLE ──
let panelOpen = true;
panelToggle.addEventListener("click", togglePanel);

function togglePanel() {
  panelOpen = !panelOpen;
  panel.classList.toggle("collapsed", !panelOpen);
}

// ── ATTRACTOR SELECT ──
const attractorChoice = document.getElementById("attractorChoice");
attractorChoice.addEventListener("change", (e) => {
  chosenIndex = e.target.value - 1;
  chosenAttractorFunction = attractors[chosenIndex];
  attractorLabel.textContent = attractorNames[chosenIndex];
  updatePaths();
});

// ── SLIDER ↔ NUMBER INPUT SYNC HELPER ──
function syncControls(sliderId, boxId, callback) {
  const slider = document.getElementById(sliderId);
  const box = document.getElementById(boxId);

  slider.addEventListener("input", (e) => {
    box.value = e.target.value;
    callback(parseFloat(e.target.value));
  });
  box.addEventListener("input", (e) => {
    slider.value = e.target.value;
    callback(parseFloat(e.target.value));
  });

  return { slider, box };
}

// ── DENSITY ──
let duration_till_replace_path = 1000;
syncControls("densitySlider", "densityBox", (v) => {
  if (v > 0 && v <= 100000) duration_till_replace_path = v;
});

// ── SPEED ──
let steps_per_frame = 3;
syncControls("speedSlider", "speedBox", (v) => {
  if (v >= 1 && v <= 15) {
    steps_per_frame = v;
    updatePaths();
  }
});

// ── NUMBER OF PATHS ──
let number_of_paths = 2;
syncControls("numberOfPathsSlider", "numberOfPathsBox", (v) => {
  if (v >= 0 && v <= 10) {
    number_of_paths = v;
    updatePaths();
  }
});

// ── ROTATION ──
let rotation_speed = 0.01;
syncControls("rotationSlider", "rotationBox", (v) => {
  if (v >= 0 && v <= 1) rotation_speed = v;
});

// ── ACTION BUTTONS ──
document
  .getElementById("resetBtn")
  .addEventListener("click", () => updatePaths());
document.getElementById("randomBtn").addEventListener("click", () => {
  const idx = Math.floor(Math.random() * attractors.length);
  attractorChoice.value = idx + 1;
  chosenIndex = idx;
  chosenAttractorFunction = attractors[idx];
  attractorLabel.textContent = attractorNames[idx];
  updatePaths();
});

// ── KEYBOARD SHORTCUTS ──
document.addEventListener("keydown", (e) => {
  // ignore if user is typing in an input
  if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePanel();
      break;
    case "KeyR":
      updatePaths();
      break;
    case "KeyN": {
      const idx = Math.floor(Math.random() * attractors.length);
      attractorChoice.value = idx + 1;
      chosenIndex = idx;
      chosenAttractorFunction = attractors[idx];
      attractorLabel.textContent = attractorNames[idx];
      updatePaths();
      break;
    }
    case "KeyT": {
      const currentIdx = THEMES.indexOf(
        document.documentElement.getAttribute("data-theme") || "terminal",
      );
      const nextIdx = (currentIdx + 1) % THEMES.length;
      setTheme(THEMES[nextIdx]);
      break;
    }
  }
});

// ── PATH MANAGEMENT ──
function updatePaths() {
  paths = [];
  colors = [];
  resetPalette();
  const epsilon_base = Math.random() - Math.random();
  for (let i = 0; i < number_of_paths; i++) {
    const epsilon = epsilon_base + (Math.random() - 0.01) * 0.001;
    const withing_point_epsilon = (Math.random() - 0.01) * 0.001;
    paths.push([
      {
        x: epsilon + withing_point_epsilon,
        y: epsilon + withing_point_epsilon,
        z: epsilon + withing_point_epsilon,
      },
    ]);
    colors.push(getNextColor());
  }
}
updatePaths();

function extendPath(path, steps) {
  for (let i = 0; i < steps; i++) {
    const lastP = path[path.length - 1];
    const p = chosenAttractorFunction(lastP, dt);
    path.push(p);
  }
  return path;
}

function scale(points, size) {
  const slice = points.slice(1);
  if (slice.length < 2) return slice;

  const mx = Math.min(...slice.map((p) => p.x));
  const Mx = Math.max(...slice.map((p) => p.x));
  const my = Math.min(...slice.map((p) => p.y));
  const My = Math.max(...slice.map((p) => p.y));
  const mz = Math.min(...slice.map((p) => p.z));
  const Mz = Math.max(...slice.map((p) => p.z));

  const s = (v, mv, Mv) =>
    Mv === mv ? size / 2 : (size * (v - mv)) / (Mv - mv);
  return slice.map(({ x, y, z }) => ({
    x: s(x, mx, Mx),
    y: s(y, my, My),
    z: s(z, mz, Mz),
  }));
}

function draw(path, i, sf) {
  if (q > 2 * Math.PI) q = 0;
  const offy = (canvas.height - sf) / 2;
  const map = ({ x, y, z }) => [
    (x - a) * Math.cos(q) - (y - b) * Math.sin(q) + c,
    z + offy,
  ];

  ctx.beginPath();
  ctx.strokeStyle = colors[i];
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.85;
  const mapped = path.slice(1).map(map);
  if (mapped.length > 0) {
    ctx.moveTo(mapped[0][0], mapped[0][1]);
    for (let j = 1; j < mapped.length; j++) {
      ctx.lineTo(mapped[j][0], mapped[j][1]);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ── FPS TRACKING ──
let frameCount = 0;
let lastFPSTime = performance.now();

function updateFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastFPSTime >= 1000) {
    fpsCounter.textContent = `${frameCount} FPS`;
    frameCount = 0;
    lastFPSTime = now;
  }
}

// ── MAIN LOOP (requestAnimationFrame) ──
function update() {
  // Subtle trail effect: dim previous frame instead of clearing
  ctx.fillStyle = trailColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  q -= rotation_speed;
  const sf = scale_factor();

  for (let i = 0; i < paths.length; i++) {
    paths[i] = extendPath(paths[i], steps_per_frame);
    draw(scale(paths[i], sf), i, sf);
    while (paths[i].length > duration_till_replace_path) paths[i].shift();
  }

  updateFPS();
  requestAnimationFrame(update);
}

// ── BOOT ──
requestAnimationFrame(update);
