const STORAGE = "red-noteboard-working-v4";
const PAGE_W = 1600;
const PAGE_H = 1100;
const COLUMNS = [
  { id: "todo", title: "Ready" },
  { id: "doing", title: "On canvas" },
  { id: "done", title: "Locked" },
];
const MEDIA = [
  { id: "oil", group: "Paint", label: "Oil", alpha: 0.92, size: 18, stamp: "round", wet: 0.15 },
  { id: "acrylic", group: "Paint", label: "Acrylic", alpha: 1, size: 14, stamp: "round", wet: 0 },
  { id: "watercolor", group: "Paint", label: "Watercolor", alpha: 0.22, size: 28, stamp: "soft", wet: 0.55 },
  { id: "round", group: "Brush", label: "Round", alpha: 0.9, size: 12, stamp: "round" },
  { id: "flat", group: "Brush", label: "Flat", alpha: 0.9, size: 20, stamp: "flat" },
  { id: "filbert", group: "Brush", label: "Filbert", alpha: 0.88, size: 16, stamp: "filbert" },
  { id: "fan", group: "Brush", label: "Fan", alpha: 0.35, size: 24, stamp: "fan" },
  { id: "liner", group: "Brush", label: "Liner", alpha: 0.95, size: 3, stamp: "round" },
  { id: "pencil", group: "Dry", label: "Pencil", alpha: 0.55, size: 2, stamp: "grain" },
  { id: "cpencil", group: "Dry", label: "Color pencil", alpha: 0.6, size: 3, stamp: "grain" },
  { id: "charcoal", group: "Dry", label: "Charcoal", alpha: 0.42, size: 10, stamp: "grain" },
  { id: "ink", group: "Ink", label: "Ink", alpha: 1, size: 3, stamp: "round" },
  { id: "inkpen", group: "Ink", label: "Ink pen", alpha: 1, size: 2, stamp: "round" },
  { id: "ballpoint", group: "Ink", label: "Ballpoint", alpha: 0.75, size: 2, stamp: "round" },
  { id: "feather", group: "Ink", label: "Quill", alpha: 0.85, size: 3, stamp: "taper" },
  { id: "sharpie", group: "Marker", label: "Sharpie", alpha: 0.95, size: 6, stamp: "round" },
  { id: "highlighter", group: "Marker", label: "Highlighter", alpha: 0.28, size: 18, stamp: "flat" },
  { id: "eraser", group: "Edit", label: "Eraser", alpha: 1, size: 16, stamp: "erase" },
  { id: "pan", group: "Edit", label: "Pan", alpha: 1, size: 1, stamp: "none" },
];
const LEFT_PRESETS = [
  { kind: "sticky", title: "Sticky note", body: "Change request", w: 180, h: 90 },
  { kind: "textbox", title: "Heading", body: "Screen title", w: 220, h: 56 },
  { kind: "textbox", title: "Text section", body: "Body copy", w: 240, h: 90 },
  { kind: "shape", title: "Button", body: "Primary", w: 140, h: 48 },
  { kind: "list", title: "List", body: "• One\n• Two", w: 200, h: 100 },
  { kind: "form", title: "Form", body: "Name\nEmail", w: 220, h: 120 },
];
const RIGHT_SHAPES = [
  { kind: "shape", title: "Rectangle", body: "", w: 160, h: 90, symbol: "▭" },
  { kind: "shape", title: "Oval", body: "", w: 140, h: 90, symbol: "◯" },
  { kind: "symbol", title: "Star", body: "★", w: 80, h: 80, symbol: "★" },
  { kind: "symbol", title: "Arrow", body: "→", w: 90, h: 60, symbol: "→" },
  { kind: "nav", title: "Navbar", body: "Logo   Home   Work", snap: "nav", w: 0.92, h: 56 },
  { kind: "footer", title: "Footer", body: "© RED", snap: "footer", w: 0.92, h: 56 },
];

function uid(p) {
  return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
function hexToRgb(hex) {
  const h = (hex || "#000000").replace("#", "");
  return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((n) => Math.max(0, Math.min(255, n | 0)).toString(16).padStart(2, "0")).join("");
}
function mixHex(a, b) {
  if (!a) return b;
  if (!b) return a;
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    session_id: "sess-001",
    session_title: "Customer walkthrough",
    section: "sketch",
    pages: [{ id: "pg-0", gx: 0, gy: 0, title: "Page 1" }],
    strokes: [],
    pieces: [],
    photos: [],
    types: [
      { id: "t-note", name: "Sticky note", kind: "sticky", symbol: "▢", color: "#FFF6A8" },
      { id: "t-box", name: "Text box", kind: "textbox", symbol: "T", color: "#FFFFFF" },
    ],
    columns: {
      todo: [{ id: "st-login", title: "Sign-in strip", body: "Quiet login.", type_id: "t-note" }],
      doing: [{ id: "st-frame", title: "Studio canvas", body: "Full bleed.", type_id: "t-note" }],
      done: [],
    },
    mixA: "#1B3A6B",
    mixB: "#C2410C",
    color: "#1B3A6B",
    hardness: 72,
    doc_title: "Meeting notes",
    doc_html: "<p>Paint the screen. Pin the change.</p>",
  };
}

const state = loadState();
const view = { x: 0, y: 0, scale: 0.4 };
let media = MEDIA[3];
let drawing = false;
let stroke = null;
let dragPreset = null;
let activePiece = null;
let mode = "draw";
let addTarget = "image";
const pointers = new Map();
const $ = (id) => document.getElementById(id);
const ink = $("ink");
const paper = $("paper");
const ictx = ink.getContext("2d");
const pctx = paper.getContext("2d");
const wctx = $("wheel").getContext("2d");

function grid() {
  const xs = state.pages.map((p) => p.gx);
  const ys = state.pages.map((p) => p.gy);
  const minx = Math.min(...xs);
  const maxx = Math.max(...xs);
  const miny = Math.min(...ys);
  const maxy = Math.max(...ys);
  return {
    minx, miny, maxx, maxy,
    w: (maxx - minx + 1) * PAGE_W,
    h: (maxy - miny + 1) * PAGE_H,
    ox: minx * PAGE_W,
    oy: miny * PAGE_H,
  };
}
function worldSize() {
  const g = grid();
  return { w: g.w, h: g.h };
}
function toLocal(x, y) {
  const g = grid();
  return { x: x - g.ox, y: y - g.oy };
}

function save() {
  state.session_title = $("sessionTitle").value.trim() || "Untitled";
  if ($("docTitle")) state.doc_title = $("docTitle").value.trim() || "Notes";
  if ($("editor")) state.doc_html = $("editor").innerHTML;
  state.color = $("inkColor").value;
  state.hardness = Number($("hardness").value);
  localStorage.setItem(STORAGE, JSON.stringify(state));
  $("status").textContent = "Saved on this device.";
}
function setStatus(m) {
  $("status").textContent = m;
}

function applyView() {
  $("world").style.width = worldSize().w + "px";
  $("world").style.height = worldSize().h + "px";
  $("world").style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}
function fitView() {
  const vp = $("viewport").getBoundingClientRect();
  const { w, h } = worldSize();
  view.scale = Math.min(vp.width / w, vp.height / h);
  view.x = (vp.width - w * view.scale) / 2;
  view.y = (vp.height - h * view.scale) / 2;
  applyView();
}
function screenToWorld(evt) {
  const vp = $("viewport").getBoundingClientRect();
  const g = grid();
  return {
    x: (evt.clientX - vp.left - view.x) / view.scale + g.ox,
    y: (evt.clientY - vp.top - view.y) / view.scale + g.oy,
  };
}

function prepCanvases() {
  const { w, h } = worldSize();
  ink.width = paper.width = w;
  ink.height = paper.height = h;
  pctx.fillStyle = "#1A222C";
  pctx.fillRect(0, 0, w, h);
  const g = grid();
  state.pages.forEach((pg) => {
    const x = pg.gx * PAGE_W - g.ox;
    const y = pg.gy * PAGE_H - g.oy;
    pctx.fillStyle = "#F4F0E8";
    pctx.fillRect(x + 10, y + 10, PAGE_W - 20, PAGE_H - 20);
    pctx.fillStyle = "rgba(20,24,32,.35)";
    pctx.font = "22px Segoe UI";
    pctx.fillText(pg.title, x + 28, y + 42);
  });
  redrawInk();
  applyView();
}

function hardnessMul() {
  return Number($("hardness").value) / 100;
}
function stampAt(ctx, x, y, m, color, size) {
  const hard = hardnessMul();
  if (m.stamp === "erase") {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.globalAlpha = m.alpha * (0.35 + hard * 0.65);
  ctx.fillStyle = color;
  if (m.stamp === "soft" || m.wet) {
    ctx.shadowColor = color;
    ctx.shadowBlur = size * (1.1 - hard) + (m.wet || 0) * 12;
  }
  if (m.stamp === "flat") ctx.fillRect(x - size, y - size * 0.35, size * 2, size * 0.7);
  else if (m.stamp === "filbert") {
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (m.stamp === "fan") {
    for (let i = -3; i <= 3; i++) {
      ctx.globalAlpha = m.alpha * hard * 0.3;
      ctx.beginPath();
      ctx.arc(x + i * size * 0.22, y, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (m.stamp === "grain") {
    for (let i = 0; i < 8; i++) {
      ctx.globalAlpha = m.alpha * hard * Math.random();
      ctx.fillRect(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size, 1.2, 1.2);
    }
  } else if (m.stamp === "taper") {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.3, y + size);
    ctx.lineTo(x - size * 0.15, y + size);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, (size / 2) * (0.6 + hard * 0.4), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function paintStroke(s) {
  const m = MEDIA.find((x) => x.id === s.media) || media;
  const pts = s.points;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[i - 1] || p;
    const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
    const steps = Math.max(1, dist / Math.max(1.5, s.size * 0.25));
    for (let t = 0; t < steps; t++) {
      const k = t / steps;
      const loc = toLocal(prev.x + (p.x - prev.x) * k, prev.y + (p.y - prev.y) * k);
      stampAt(ictx, loc.x, loc.y, m, s.color, s.size);
    }
  }
}
function redrawInk() {
  ictx.clearRect(0, 0, ink.width, ink.height);
  for (const s of state.strokes) paintStroke(s);
}

function renderPieces() {
  const root = $("pins");
  root.innerHTML = "";
  state.pieces.forEach((p) => {
    const loc = toLocal(p.x, p.y);
    const el = document.createElement("article");
    el.className = `piece ${p.kind}`;
    el.style.left = loc.x + "px";
    el.style.top = loc.y + "px";
    el.style.width = p.w + "px";
    el.style.height = p.h + "px";
    if (p.color) el.style.background = p.color;
    if (p.kind === "photo" && p.src) el.innerHTML = `<img alt="" src="${p.src}" /><div class="handle"></div>`;
    else if (p.kind === "video" && p.src) el.innerHTML = `<video src="${p.src}" controls></video><div class="handle"></div>`;
    else el.innerHTML = `<div class="edit" contenteditable="true">${escapeHtml(p.title)}\n${escapeHtml(p.body || "")}</div><div class="handle"></div>`;
    bindPiece(el, p);
    root.appendChild(el);
  });
}
function bindPiece(el, p) {
  const edit = el.querySelector(".edit");
  if (edit) {
    edit.addEventListener("input", () => {
      const parts = edit.innerText.split("\n");
      p.title = parts[0] || "";
      p.body = parts.slice(1).join("\n");
      save();
    });
  }
  el.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("handle")) activePiece = { id: p.id, resize: true, x: e.clientX, y: e.clientY, w: p.w, h: p.h };
    else if (e.target.classList.contains("edit") || e.target.tagName === "VIDEO") {
      activePiece = null;
      return;
    } else activePiece = { id: p.id, resize: false, x: e.clientX, y: e.clientY, px: p.x, py: p.y };
    el.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });
}
function pieceMove(evt) {
  if (!activePiece) return;
  const p = state.pieces.find((x) => x.id === activePiece.id);
  if (!p) return;
  const dx = (evt.clientX - activePiece.x) / view.scale;
  const dy = (evt.clientY - activePiece.y) / view.scale;
  if (activePiece.resize) {
    p.w = Math.max(48, activePiece.w + dx);
    p.h = Math.max(32, activePiece.h + dy);
  } else {
    p.x = activePiece.px + dx;
    p.y = activePiece.py + dy;
    if (p.snap === "nav") {
      const cell = nearestPage(p.x, p.y);
      p.x = cell.gx * PAGE_W + PAGE_W * 0.04;
      p.y = cell.gy * PAGE_H + PAGE_H * 0.04;
      p.w = PAGE_W * 0.92;
    }
    if (p.snap === "footer") {
      const cell = nearestPage(p.x, p.y);
      p.x = cell.gx * PAGE_W + PAGE_W * 0.04;
      p.y = cell.gy * PAGE_H + PAGE_H * 0.88;
      p.w = PAGE_W * 0.92;
    }
  }
  renderPieces();
}
function nearestPage(x, y) {
  return state.pages.reduce((best, p) => {
    const d = Math.hypot(x - (p.gx + 0.5) * PAGE_W, y - (p.gy + 0.5) * PAGE_H);
    return !best || d < best.d ? { ...p, d } : best;
  }, null);
}

function dropPreset(evt, preset, extra) {
  const wpt = screenToWorld(evt);
  const piece = {
    id: uid("pc"),
    kind: preset.kind,
    title: preset.title,
    body: preset.body || "",
    x: wpt.x - 30,
    y: wpt.y - 20,
    w: preset.w > 1 ? preset.w : PAGE_W * (preset.w || 0.2),
    h: preset.h || 64,
    snap: preset.snap || null,
    color: extra?.color || state.color,
    src: extra?.src,
  };
  if (piece.snap) pieceMove({ clientX: 0, clientY: 0 });
  if (piece.snap === "nav" || piece.snap === "footer") {
    const cell = nearestPage(piece.x, piece.y) || state.pages[0];
    piece.x = cell.gx * PAGE_W + PAGE_W * 0.04;
    piece.y = cell.gy * PAGE_H + (piece.snap === "nav" ? PAGE_H * 0.04 : PAGE_H * 0.88);
    piece.w = PAGE_W * 0.92;
  }
  state.pieces.push(piece);
  save();
  renderPieces();
}

function chip(preset, extra) {
  const el = document.createElement("article");
  el.className = `chip ${preset.kind}`;
  el.draggable = true;
  el.textContent = (preset.symbol ? preset.symbol + " " : "") + preset.title;
  if (extra?.color) el.style.background = extra.color;
  const pack = { preset, extra };
  el.addEventListener("dragstart", () => {
    dragPreset = pack;
  });
  el.addEventListener("pointerdown", () => {
    dragPreset = pack;
  });
  return el;
}
function renderKits() {
  $("leftKit").innerHTML = "";
  LEFT_PRESETS.forEach((p) => $("leftKit").appendChild(chip(p)));
  state.types.forEach((t) => $("leftKit").appendChild(chip({ kind: t.kind, title: t.name, body: t.name, w: 180, h: 80, symbol: t.symbol }, { color: t.color })));
  $("rightKit").innerHTML = "";
  RIGHT_SHAPES.forEach((p) => $("rightKit").appendChild(chip(p, { color: state.color })));
  $("pageKit").innerHTML = "";
  state.pages.forEach((pg) => {
    const b = document.createElement("button");
    b.className = "tab";
    b.textContent = `${pg.title} (${pg.gx},${pg.gy})`;
    b.addEventListener("click", () => panToPage(pg));
    $("pageKit").appendChild(b);
  });
  const photos = $("photoKit");
  photos.innerHTML = "";
  state.photos.forEach((ph) => {
    photos.appendChild(chip({ kind: ph.kind || "photo", title: ph.kind === "video" ? "Video" : "Photo", w: 240, h: 160 }, { src: ph.src }));
  });
}
function panToPage(pg) {
  const vp = $("viewport").getBoundingClientRect();
  const g = grid();
  const lx = pg.gx * PAGE_W - g.ox;
  const ly = pg.gy * PAGE_H - g.oy;
  view.scale = Math.min(vp.width / PAGE_W, vp.height / PAGE_H) * 0.92;
  view.x = -lx * view.scale + (vp.width - PAGE_W * view.scale) / 2;
  view.y = -ly * view.scale + (vp.height - PAGE_H * view.scale) / 2;
  applyView();
  closeDrawers();
}

function renderMedia() {
  const dock = $("mediaDock");
  dock.innerHTML = "";
  MEDIA.forEach((m) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = m.label;
    if (media.id === m.id) b.classList.add("is-on");
    b.addEventListener("click", () => {
      media = m;
      mode = m.id === "pan" ? "pan" : "draw";
      $("inkWidth").value = String(m.size);
      $("toolFab").textContent = m.label;
      $("toolName").textContent = m.label;
      renderMedia();
    });
    dock.appendChild(b);
  });
}

function drawWheel() {
  const c = $("wheel");
  const r = c.width / 2;
  for (let i = 0; i < 360; i++) {
    wctx.beginPath();
    wctx.moveTo(r, r);
    wctx.arc(r, r, r, ((i - 1) * Math.PI) / 180, (i * Math.PI) / 180);
    wctx.closePath();
    wctx.fillStyle = `hsl(${i} 90% 50%)`;
    wctx.fill();
  }
  wctx.beginPath();
  wctx.arc(r, r, r * 0.28, 0, Math.PI * 2);
  wctx.fillStyle = "#fff";
  wctx.fill();
}
function wheelPick(evt) {
  const r = $("wheel").getBoundingClientRect();
  const x = evt.clientX - r.left - r.width / 2;
  const y = evt.clientY - r.top - r.height / 2;
  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const sat = Math.min(1, Math.hypot(x, y) / (r.width / 2));
  if (sat < 0.22) return;
  const color = hslToHex(hue, 0.9, 0.35 + sat * 0.2);
  setColor(color);
}
function hslToHex(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c);
  };
  return rgbToHex(f(0), f(8), f(4));
}
function setColor(c) {
  state.color = c;
  $("inkColor").value = c;
  $("mixOut").style.background = c;
  renderKits();
  save();
}
function paintMixWells() {
  $("mixA").style.background = state.mixA;
  $("mixB").style.background = state.mixB;
  $("mixOut").style.background = mixHex(state.mixA, state.mixB);
}

function addPage(dir) {
  const xs = state.pages.map((p) => p.gx);
  const ys = state.pages.map((p) => p.gy);
  let gx = 0;
  let gy = 0;
  if (dir === "left") gx = Math.min(...xs) - 1;
  if (dir === "right") gx = Math.max(...xs) + 1;
  if (dir === "top") gy = Math.min(...ys) - 1;
  if (dir === "bottom") gy = Math.max(...ys) + 1;
  if (dir === "left" || dir === "right") gy = 0;
  if (dir === "top" || dir === "bottom") gx = 0;
  const page = { id: uid("pg"), gx, gy, title: `Page ${state.pages.length + 1}` };
  state.pages.push(page);
  save();
  prepCanvases();
  renderKits();
  panToPage(page);
  setStatus(`${page.title} added. Two-finger drag to travel.`);
}

function renderTypes() {
  const gridEl = $("typeGrid");
  gridEl.innerHTML = "";
  state.types.forEach((t) => {
    const el = document.createElement("article");
    el.className = "type-card";
    el.innerHTML = `<strong>${t.symbol} ${t.name}</strong>`;
    gridEl.appendChild(el);
  });
}
function renderColumns() {
  const root = $("columns");
  root.innerHTML = "";
  COLUMNS.forEach((col) => {
    const wrap = document.createElement("section");
    wrap.innerHTML = `<h3>${col.title}</h3>`;
    (state.columns[col.id] || []).forEach((card) => {
      const el = document.createElement("article");
      el.className = "card";
      el.textContent = card.title;
      wrap.appendChild(el);
    });
    root.appendChild(wrap);
  });
}
function escapeHtml(s) {
  return String(s || "").replaceAll("&", "&").replaceAll("<", "<").replaceAll(">", ">");
}
function showSection(name) {
  state.section = name;
  document.querySelectorAll("#pageMenu .tab").forEach((b) => b.classList.toggle("is-on", b.dataset.section === name));
  document.querySelectorAll(".view").forEach((v) => {
    const on = v.id === `view-${name}`;
    v.classList.toggle("is-on", on);
    v.hidden = !on;
  });
  $("pageMenu").hidden = true;
  if (name === "sketch") requestAnimationFrame(() => {
    prepCanvases();
    fitView();
    renderPieces();
  });
  save();
}

function startDraw(evt) {
  if (activePiece || evt.target.closest(".piece")) return;
  pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY });
  if (mode === "pan" || pointers.size > 1) return;
  const w = screenToWorld(evt);
  drawing = true;
  stroke = { media: media.id, color: state.color, size: Number($("inkWidth").value), hard: hardnessMul(), points: [{ x: w.x, y: w.y }] };
}
function moveDraw(evt) {
  if (activePiece) {
    pieceMove(evt);
    return;
  }
  if (pointers.has(evt.pointerId) && (!drawing || pointers.size > 1 || mode === "pan")) {
    const prev = pointers.get(evt.pointerId);
    if (pointers.size === 1) {
      view.x += evt.clientX - prev.x;
      view.y += evt.clientY - prev.y;
      applyView();
    } else if (pointers.size === 2) {
      const before = [...pointers.values()];
      const oldD = Math.hypot(before[0].x - before[1].x, before[0].y - before[1].y) || 1;
      pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY });
      const now = [...pointers.values()];
      const newD = Math.hypot(now[0].x - now[1].x, now[0].y - now[1].y) || 1;
      zoomAt((evt.clientX + prev.x) / 2, (evt.clientY + prev.y) / 2, newD / oldD);
      return;
    }
    pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY });
    return;
  }
  if (!drawing || !stroke) return;
  const w = screenToWorld(evt);
  stroke.points.push({ x: w.x, y: w.y });
  paintStroke({ ...stroke, points: stroke.points.slice(-2) });
}
function endDraw() {
  pointers.clear();
  if (activePiece) {
    activePiece = null;
    save();
    return;
  }
  if (stroke && stroke.points.length > 1) {
    state.strokes.push(stroke);
    save();
  }
  stroke = null;
  drawing = false;
}
function zoomAt(cx, cy, factor) {
  const vp = $("viewport").getBoundingClientRect();
  const g = grid();
  const wx = (cx - vp.left - view.x) / view.scale + g.ox;
  const wy = (cy - vp.top - view.y) / view.scale + g.oy;
  view.scale = Math.min(8, Math.max(0.08, view.scale * factor));
  view.x = cx - vp.left - (wx - g.ox) * view.scale;
  view.y = cy - vp.top - (wy - g.oy) * view.scale;
  applyView();
}

function toggleDrawer(side) {
  const el = $(side === "left" ? "leftDrawer" : "rightDrawer");
  const other = $(side === "left" ? "rightDrawer" : "leftDrawer");
  const open = !el.classList.contains("is-open");
  el.classList.toggle("is-open", open);
  other.classList.remove("is-open");
  $("dim").hidden = !open;
}
function closeDrawers() {
  $("leftDrawer").classList.remove("is-open");
  $("rightDrawer").classList.remove("is-open");
  $("dim").hidden = true;
  $("addMenu").hidden = true;
  $("pageMenu").hidden = true;
}

function htmlToMarkdown(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.innerText + "\n";
}
function download(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}
function slug(s) {
  return (s || "noteboard").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "noteboard";
}
function exportMd() {
  save();
  download(slug(state.doc_title) + ".md", new Blob([`# ${state.doc_title}\n\n${htmlToMarkdown(state.doc_html)}`], { type: "text/markdown" }));
}
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function u16(n) {
  return Uint8Array.of(n & 255, (n >>> 8) & 255);
}
function u32(n) {
  return Uint8Array.of(n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255);
}
function cat(parts) {
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}
function zipStore(files) {
  const enc = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = typeof f.data === "string" ? enc.encode(f.data) : f.data;
    const crc = crc32(data);
    const local = cat([u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), name, data]);
    const central = cat([u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const body = cat(locals);
  const dir = cat(centrals);
  return cat([body, dir, cat([u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(dir.length), u32(body.length), u16(0)])]);
}
function exportDocx() {
  save();
  const paras = ($("editor").innerText || "").split("\n").map((l) => `<w:p><w:r><w:t>${l.replaceAll("&", "&").replaceAll("<", "<")}</w:t></w:r></w:p>`).join("");
  const documentXml = `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras}</w:body></w:document>`;
  const types = `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  download(slug(state.doc_title) + ".docx", new Blob([zipStore([{ name: "[Content_Types].xml", data: types }, { name: "_rels/.rels", data: rels }, { name: "word/document.xml", data: documentXml }])]));
}
function exportFigma() {
  save();
  download(slug(state.session_title) + ".figma-handoff.json", new Blob([JSON.stringify({ schema: "red-noteboard-figma-handoff-v1", live_figma_file: false, pages: state.pages, pieces: state.pieces }, null, 2)], { type: "application/json" }));
}

function bind() {
  $("sessionTitle").value = state.session_title;
  $("docTitle").value = state.doc_title;
  $("editor").innerHTML = state.doc_html;
  $("inkColor").value = state.color;
  $("hardness").value = String(state.hardness || 72);
  $("toolFab").textContent = media.label;
  document.querySelectorAll("[data-section]").forEach((b) => b.addEventListener("click", () => showSection(b.dataset.section)));
  $("btnPages").addEventListener("click", () => {
    $("pageMenu").hidden = !$("pageMenu").hidden;
    $("addMenu").hidden = true;
  });
  $("btnAdd").addEventListener("click", () => {
    $("addMenu").hidden = !$("addMenu").hidden;
    $("pageMenu").hidden = true;
  });
  $("btnLeft").addEventListener("click", () => toggleDrawer("left"));
  $("btnRight").addEventListener("click", () => toggleDrawer("right"));
  $("dim").addEventListener("click", closeDrawers);
  $("toolFab").addEventListener("click", () => {
    $("toolSheet").hidden = !$("toolSheet").hidden;
  });
  $("btnUndo").addEventListener("click", () => {
    state.strokes.pop();
    redrawInk();
    save();
  });
  $("btnFit").addEventListener("click", fitView);
  $("btnMax").addEventListener("click", () => {
    const go = !document.fullscreenElement;
    Promise.resolve(go ? $("studio").requestFullscreen?.() : document.exitFullscreen?.()).catch(() => {});
    document.body.classList.toggle("is-max", go);
  });
  $("wheel").addEventListener("pointerdown", wheelPick);
  $("mixA").addEventListener("click", () => {
    state.mixA = state.color;
    paintMixWells();
    save();
  });
  $("mixB").addEventListener("click", () => {
    state.mixB = state.color;
    paintMixWells();
    save();
  });
  $("mixOut").addEventListener("click", () => setColor(mixHex(state.mixA, state.mixB)));
  document.querySelectorAll("[data-add]").forEach((b) => {
    b.addEventListener("click", () => {
      const kind = b.dataset.add;
      $("addMenu").hidden = true;
      if (kind === "image" || kind === "video") {
        addTarget = kind;
        $("fileImport").accept = kind === "video" ? "video/*" : "image/*";
        $("fileImport").click();
      } else addPage(kind);
    });
  });
  $("fileImport").addEventListener("change", (e) => {
    [...e.target.files || []].forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        state.photos.push({ id: uid("ph"), kind: addTarget, src: String(reader.result) });
        save();
        renderKits();
        setStatus(`${addTarget} in the left drawer. Drag it onto the canvas.`);
      };
      reader.readAsDataURL(file);
    });
  });
  const vp = $("viewport");
  vp.addEventListener("pointerdown", startDraw);
  vp.addEventListener("pointermove", moveDraw);
  vp.addEventListener("pointerup", endDraw);
  vp.addEventListener("pointercancel", endDraw);
  vp.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 0.9 : 1.1);
  }, { passive: false });
  vp.addEventListener("dragover", (e) => e.preventDefault());
  vp.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragPreset) dropPreset(e, dragPreset.preset, dragPreset.extra);
    dragPreset = null;
  });
  $("btnAddType").addEventListener("click", () => {
    const name = prompt("Type name", "Callout");
    if (!name) return;
    state.types.push({ id: uid("t"), name, kind: "shape", symbol: prompt("Symbol", "◆") || "◆", color: state.color });
    save();
    renderTypes();
    renderKits();
  });
  $("btnAddSticky").addEventListener("click", () => {
    const title = prompt("Piece title", "New piece");
    if (!title) return;
    state.columns.todo.push({ id: uid("st"), title, body: "", type_id: "t-note" });
    save();
    renderColumns();
  });
  $("btnExportMd").addEventListener("click", exportMd);
  $("btnExportDocx").addEventListener("click", exportDocx);
  $("btnExportFigma").addEventListener("click", exportFigma);
  document.querySelectorAll("[data-cmd]").forEach((b) => b.addEventListener("click", () => document.execCommand(b.dataset.cmd, false)));
  $("sessionTitle").addEventListener("change", save);
  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("is-max", !!document.fullscreenElement);
    setTimeout(fitView, 120);
  });
}

bind();
drawWheel();
paintMixWells();
renderMedia();
renderKits();
renderTypes();
renderColumns();
prepCanvases();
fitView();
renderPieces();
setStatus("Canvas is the page. Pieces and Shapes start closed.");
