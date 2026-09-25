const STORAGE = "red-noteboard-working-v3";
const WORLD_W = 2400;
const WORLD_H = 1600;
const COLUMNS = [
  { id: "todo", title: "Ready" },
  { id: "doing", title: "On canvas" },
  { id: "done", title: "Locked" },
];

const PIGMENTS = [
  "#1B3A6B","#0E7490","#147A3D","#C9A227","#C2410C","#9F1239","#6D28D9","#111827","#FFFFFF","#F5E6C8",
  "#7F1D1D","#9A3412","#A16207","#3F6212","#155E75","#1E3A8A","#4C1D95","#831843","#44403C","#0F172A",
  "#FB7185","#FDBA74","#FDE68A","#86EFAC","#67E8F9","#93C5FD","#C4B5FD","#F9A8D4","#D6D3D1","#000000",
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
  { kind: "textbox", title: "Text box", body: "Detail copy", w: 220, h: 80 },
  { kind: "symbol", title: "●", body: "Marker", w: 70, h: 48 },
  { kind: "shape", title: "Button", body: "Primary", w: 140, h: 48 },
];

const RIGHT_PRESETS = [
  { kind: "nav", title: "Navbar", body: "Logo    Home    Work    Contact", snap: "nav", w: 0.92, h: 56 },
  { kind: "footer", title: "Footer", body: "© RED · Privacy · Contact", snap: "footer", w: 0.92, h: 56 },
  { kind: "list", title: "List", body: "• Item one\n• Item two\n• Item three", w: 200, h: 110 },
  { kind: "form", title: "Form", body: "Name\nEmail\n[ Send ]", w: 220, h: 130 },
];

function uid(p) {
  return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function defaultTypes() {
  return [
    { id: "t-note", name: "Sticky note", kind: "sticky", symbol: "▢", color: "#FFF6A8" },
    { id: "t-box", name: "Text box", kind: "textbox", symbol: "T", color: "#FFFFFF" },
    { id: "t-oval", name: "Oval note", kind: "shape", symbol: "◯", color: "#D5E6F5" },
    { id: "t-star", name: "Priority", kind: "symbol", symbol: "★", color: "#FDE68A" },
    { id: "t-photo", name: "Photo frame", kind: "photo", symbol: "▣", color: "#E5E7EB" },
  ];
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
    strokes: [],
    pieces: [],
    photos: [],
    types: defaultTypes(),
    columns: {
      todo: [
        { id: "st-login", title: "Sign-in strip", body: "Quiet login.", type_id: "t-note" },
        { id: "st-nav", title: "Top nav", body: "Snap a navbar.", type_id: "t-box" },
      ],
      doing: [{ id: "st-frame", title: "Studio canvas", body: "Zoom and paint.", type_id: "t-note" }],
      done: [{ id: "st-name", title: "board_session", body: "IDs not titles.", type_id: "t-star" }],
    },
    mix: ["#1B3A6B", "#C2410C", "#147A3D", "#FFFFFF", null, null, null, null],
    color: "#1B3A6B",
    doc_title: "Meeting notes",
    doc_html: "<h2>Walkthrough</h2><p>Paint the screen. Pin the change. Write the ask.</p>",
  };
}

const state = loadState();
const view = { x: 80, y: 40, scale: 0.42 };
let media = MEDIA[3];
let drawing = false;
let stroke = null;
let dragPreset = null;
let activePiece = null;
let mode = "draw";
const pointers = new Map();

const $ = (id) => document.getElementById(id);
const ink = $("ink");
const paper = $("paper");
const ictx = ink.getContext("2d");
const pctx = paper.getContext("2d");

function save() {
  state.session_title = $("sessionTitle").value.trim() || "Untitled";
  if ($("docTitle")) state.doc_title = $("docTitle").value.trim() || "Meeting notes";
  if ($("editor")) state.doc_html = $("editor").innerHTML;
  state.color = $("inkColor").value;
  localStorage.setItem(STORAGE, JSON.stringify(state));
  $("status").textContent = "Saved on this device.";
}

function setStatus(m) {
  $("status").textContent = m;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
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

function applyView() {
  $("world").style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  $("zoomReadout").textContent = `${Math.round(view.scale * 100)}%`;
}

function fitView() {
  const vp = $("viewport").getBoundingClientRect();
  view.scale = Math.min(vp.width / WORLD_W, vp.height / WORLD_H) * 0.92;
  view.x = (vp.width - WORLD_W * view.scale) / 2;
  view.y = (vp.height - WORLD_H * view.scale) / 2;
  applyView();
}

function screenToWorld(evt) {
  const vp = $("viewport").getBoundingClientRect();
  return {
    x: (evt.clientX - vp.left - view.x) / view.scale,
    y: (evt.clientY - vp.top - view.y) / view.scale,
  };
}

function prepCanvases() {
  for (const c of [ink, paper]) {
    c.width = WORLD_W;
    c.height = WORLD_H;
  }
  pctx.fillStyle = "#F7F4EE";
  pctx.fillRect(0, 0, WORLD_W, WORLD_H);
  redrawInk();
}

function stampAt(ctx, x, y, m, color, size) {
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
  ctx.globalAlpha = m.alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  if (m.stamp === "soft" || m.wet) {
    ctx.shadowColor = color;
    ctx.shadowBlur = size * (0.8 + (m.wet || 0));
  }
  if (m.stamp === "flat") {
    ctx.fillRect(x - size, y - size * 0.35, size * 2, size * 0.7);
  } else if (m.stamp === "filbert") {
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (m.stamp === "fan") {
    for (let i = -3; i <= 3; i++) {
      ctx.globalAlpha = m.alpha * 0.35;
      ctx.beginPath();
      ctx.arc(x + i * size * 0.22, y, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (m.stamp === "grain") {
    for (let i = 0; i < 8; i++) {
      ctx.globalAlpha = m.alpha * Math.random();
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
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
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
      stampAt(ictx, prev.x + (p.x - prev.x) * k, prev.y + (p.y - prev.y) * k, m, s.color, s.size);
    }
  }
}

function redrawInk() {
  ictx.clearRect(0, 0, WORLD_W, WORLD_H);
  for (const s of state.strokes) paintStroke(s);
}

function renderPieces() {
  const root = $("pins");
  root.innerHTML = "";
  for (const p of state.pieces) {
    const el = document.createElement("article");
    el.className = `piece ${p.kind}`;
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    el.style.height = p.h + "px";
    if (p.color) el.style.background = p.color;
    if (p.kind === "photo" && p.src) {
      el.innerHTML = `<img alt="" src="${p.src}" /><div class="handle"></div>`;
    } else {
      el.innerHTML = `<div class="edit" contenteditable="true">${escapeHtml(p.title)}\n${escapeHtml(p.body || "")}</div><div class="handle"></div>`;
    }
    bindPiece(el, p);
    root.appendChild(el);
  }
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
    if (e.target.classList.contains("handle")) {
      activePiece = { id: p.id, resize: true, x: e.clientX, y: e.clientY, w: p.w, h: p.h };
    } else if (e.target.classList.contains("edit")) {
      activePiece = null;
      return;
    } else {
      activePiece = { id: p.id, resize: false, x: e.clientX, y: e.clientY, px: p.x, py: p.y };
    }
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
      p.x = WORLD_W * 0.04;
      p.y = WORLD_H * 0.03;
      p.w = WORLD_W * 0.92;
    }
    if (p.snap === "footer") {
      p.x = WORLD_W * 0.04;
      p.y = WORLD_H * 0.9;
      p.w = WORLD_W * 0.92;
    }
  }
  renderPieces();
}

function dropPreset(evt, preset, extra) {
  const wpt = screenToWorld(evt);
  const piece = {
    id: uid("pc"),
    kind: preset.kind,
    title: preset.title,
    body: preset.body || "",
    x: Math.max(20, wpt.x - 40),
    y: Math.max(20, wpt.y - 20),
    w: preset.w > 1 ? preset.w : WORLD_W * (preset.w || 0.2),
    h: preset.h || 64,
    snap: preset.snap || null,
    color: extra?.color,
    src: extra?.src,
    type_id: extra?.type_id,
  };
  if (piece.snap === "nav") {
    piece.x = WORLD_W * 0.04;
    piece.y = WORLD_H * 0.03;
    piece.w = WORLD_W * 0.92;
    piece.h = 64;
  }
  if (piece.snap === "footer") {
    piece.x = WORLD_W * 0.04;
    piece.y = WORLD_H * 0.9;
    piece.w = WORLD_W * 0.92;
    piece.h = 64;
  }
  state.pieces.push(piece);
  save();
  renderPieces();
  setStatus(`Placed ${piece.title}.`);
}

function renderKits() {
  const left = $("leftKit");
  left.innerHTML = "";
  LEFT_PRESETS.forEach((p) => left.appendChild(chip(p)));
  state.types.forEach((t) => {
    left.appendChild(
      chip({ kind: t.kind, title: `${t.symbol} ${t.name}`, body: t.name, w: 180, h: 80, color: t.color }, t),
    );
  });
  const right = $("rightKit");
  right.innerHTML = "";
  RIGHT_PRESETS.forEach((p) => right.appendChild(chip(p)));
  renderPhotos();
}

function chip(preset, type) {
  const el = document.createElement("article");
  el.className = `chip ${preset.kind}`;
  el.draggable = true;
  el.textContent = preset.title;
  el.addEventListener("dragstart", () => {
    dragPreset = { preset, type };
  });
  el.addEventListener("pointerdown", () => {
    dragPreset = { preset, type };
  });
  return el;
}

function renderPhotos() {
  const root = $("photoKit");
  root.innerHTML = "";
  state.photos.forEach((ph) => {
    const el = document.createElement("article");
    el.className = "chip photo";
    el.draggable = true;
    el.innerHTML = `<img alt="" src="${ph.src}" />`;
    const preset = { kind: "photo", title: "Photo", body: "", w: 240, h: 160 };
    el.addEventListener("dragstart", () => {
      dragPreset = { preset, src: ph.src };
    });
    el.addEventListener("pointerdown", () => {
      dragPreset = { preset, src: ph.src };
    });
    root.appendChild(el);
  });
}

function renderMedia() {
  const dock = $("mediaDock");
  dock.innerHTML = "";
  let last = "";
  MEDIA.forEach((m) => {
    if (m.group !== last) {
      const tag = document.createElement("span");
      tag.textContent = m.group;
      tag.style.cssText = "font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9AA8BD;padding:8px 4px;";
      dock.appendChild(tag);
      last = m.group;
    }
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = m.label;
    if (media.id === m.id) b.classList.add("is-on");
    b.addEventListener("click", () => {
      media = m;
      mode = m.id === "pan" ? "pan" : "draw";
      $("inkWidth").value = String(m.size);
      renderMedia();
    });
    dock.appendChild(b);
  });
}

function renderPalette() {
  const wells = $("wells");
  wells.innerHTML = "";
  PIGMENTS.forEach((c) => {
    const b = document.createElement("button");
    b.className = "well";
    b.style.background = c;
    b.title = c;
    b.addEventListener("click", () => setColor(c));
    wells.appendChild(b);
  });
  const plate = $("mixPlate");
  plate.innerHTML = "";
  state.mix.forEach((c, i) => {
    const s = document.createElement("button");
    s.className = "mix-slot";
    s.style.background = c || "transparent";
    s.addEventListener("click", () => {
      if (!c) state.mix[i] = $("inkColor").value;
      else setColor(mixHex(c, $("inkColor").value));
      save();
      renderPalette();
    });
    plate.appendChild(s);
  });
  $("mixSwatch").style.background = $("inkColor").value;
}

function setColor(c) {
  state.color = c;
  $("inkColor").value = c;
  $("mixSwatch").style.background = c;
  save();
}

function renderTypes() {
  const grid = $("typeGrid");
  grid.innerHTML = "";
  state.types.forEach((t) => {
    const el = document.createElement("article");
    el.className = "type-card";
    el.innerHTML = `<strong>${t.symbol} ${t.name}</strong><div>${t.kind}</div>`;
    el.style.borderLeft = `6px solid ${t.color}`;
    grid.appendChild(el);
  });
}

function renderColumns() {
  const root = $("columns");
  root.innerHTML = "";
  COLUMNS.forEach((col) => {
    const wrap = document.createElement("section");
    wrap.className = "column";
    wrap.innerHTML = `<h3>${col.title}</h3>`;
    wrap.addEventListener("dragover", (e) => e.preventDefault());
    wrap.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/sticky-id");
      if (id) moveCard(id, col.id);
    });
    (state.columns[col.id] || []).forEach((card) => {
      const el = document.createElement("article");
      el.className = "card";
      el.draggable = true;
      el.innerHTML = `<strong>${escapeHtml(card.title)}</strong><div>${escapeHtml(card.body || "")}</div>`;
      el.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/sticky-id", card.id));
      wrap.appendChild(el);
    });
    root.appendChild(wrap);
  });
}

function moveCard(id, columnId) {
  let found = null;
  COLUMNS.forEach((c) => {
    const i = state.columns[c.id].findIndex((x) => x.id === id);
    if (i >= 0) found = state.columns[c.id].splice(i, 1)[0];
  });
  if (found) state.columns[columnId].push(found);
  save();
  renderColumns();
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">");
}

function showSection(name) {
  state.section = name;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("is-on", b.dataset.section === name));
  document.querySelectorAll(".view").forEach((v) => {
    const on = v.id === `view-${name}`;
    v.classList.toggle("is-on", on);
    v.hidden = !on;
  });
  if (name === "sketch") requestAnimationFrame(() => {
    fitView();
    prepCanvases();
    renderPieces();
  });
  save();
}

function startDraw(evt) {
  if (activePiece || evt.target.closest(".piece")) return;
  if (mode === "pan" || (evt.pointerType !== "pen" && pointers.size >= 1 && !drawing)) {
    pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY });
    return;
  }
  if (dragPreset && evt.type === "pointerup") return;
  const w = screenToWorld(evt);
  drawing = true;
  stroke = {
    media: media.id,
    color: $("inkColor").value,
    size: Number($("inkWidth").value),
    points: [{ x: w.x, y: w.y }],
  };
  $("viewport").setPointerCapture(evt.pointerId);
}

function moveDraw(evt) {
  if (activePiece) {
    pieceMove(evt);
    return;
  }
  if (pointers.has(evt.pointerId) && !drawing) {
    const prev = pointers.get(evt.pointerId);
    if (pointers.size === 1) {
      view.x += evt.clientX - prev.x;
      view.y += evt.clientY - prev.y;
      applyView();
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const oldD = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
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

function endDraw(evt) {
  pointers.delete(evt.pointerId);
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
  const wx = (cx - vp.left - view.x) / view.scale;
  const wy = (cy - vp.top - view.y) / view.scale;
  view.scale = Math.min(8, Math.max(0.12, view.scale * factor));
  view.x = cx - vp.left - wx * view.scale;
  view.y = cy - vp.top - wy * view.scale;
  applyView();
}

function toggleMax() {
  const studio = $("studio");
  const go = !document.fullscreenElement;
  const req = go ? studio.requestFullscreen?.() || document.documentElement.requestFullscreen?.() : document.exitFullscreen?.();
  Promise.resolve(req).catch(() => {});
  document.body.classList.toggle("is-max", go);
  setTimeout(() => {
    fitView();
    setStatus(go ? "Full screen. Rotate to landscape if you want more canvas." : "Chrome back.");
  }, 200);
}

function htmlToMarkdown(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const walk = (node) => {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeName === "BR") return "\n";
    const inner = [...node.childNodes].map(walk).join("");
    if (node.nodeName === "H2") return `## ${inner.trim()}\n\n`;
    if (node.nodeName === "P") return `${inner.trim()}\n\n`;
    if (node.nodeName === "LI") return `- ${inner.trim()}\n`;
    return inner;
  };
  return walk(tmp).trim() + "\n";
}
function download(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1200);
}
function slug(s) {
  return (s || "noteboard").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "noteboard";
}
function exportMd() {
  save();
  const pins = state.pieces.map((p) => `- ${p.kind}: ${p.title}`).join("\n") || "- none";
  download(
    slug(state.doc_title) + ".md",
    new Blob([`# ${state.doc_title}\n\n${pins}\n\n${htmlToMarkdown(state.doc_html)}\n`], { type: "text/markdown" }),
  );
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
  const text = `${state.doc_title}\n${$("editor").innerText}`;
  const paras = text.split("\n").map((line) => `<w:p><w:r><w:t xml:space="preserve">${line.replaceAll("&", "&").replaceAll("<", "<")}</w:t></w:r></w:p>`).join("");
  const documentXml = `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras}</w:body></w:document>`;
  const types = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  download(slug(state.doc_title) + ".docx", new Blob([zipStore([{ name: "[Content_Types].xml", data: types }, { name: "_rels/.rels", data: rels }, { name: "word/document.xml", data: documentXml }])], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
}
function exportFigma() {
  save();
  const spec = {
    schema: "red-noteboard-figma-handoff-v1",
    live_figma_file: false,
    sku: "Working",
    session_id: state.session_id,
    frame: { name: state.session_title, width: WORLD_W, height: WORLD_H, children: state.pieces.map((p) => ({ id: p.id, type: p.kind.toUpperCase(), x: p.x, y: p.y, width: p.w, height: p.h, characters: `${p.title}\n${p.body || ""}` })) },
  };
  download(slug(state.session_title) + ".figma-handoff.json", new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" }));
}

function bind() {
  $("sessionTitle").value = state.session_title;
  $("docTitle").value = state.doc_title;
  $("editor").innerHTML = state.doc_html;
  $("inkColor").value = state.color;
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => showSection(b.dataset.section)));
  document.querySelectorAll(".drawer-toggle").forEach((b) => {
    b.addEventListener("click", () => {
      const side = b.dataset.side;
      const drawer = $(side === "left" ? "leftDrawer" : "rightDrawer");
      drawer.classList.toggle("is-open");
      $("studio").classList.toggle(side + "-closed", !drawer.classList.contains("is-open"));
    });
  });
  $("btnZoomIn").addEventListener("click", () => zoomAt(innerWidth / 2, innerHeight / 2, 1.25));
  $("btnZoomOut").addEventListener("click", () => zoomAt(innerWidth / 2, innerHeight / 2, 0.8));
  $("btnFit").addEventListener("click", fitView);
  $("btnMax").addEventListener("click", toggleMax);
  $("btnUndo").addEventListener("click", () => {
    state.strokes.pop();
    redrawInk();
    save();
  });
  $("inkColor").addEventListener("input", () => setColor($("inkColor").value));
  const vp = $("viewport");
  vp.addEventListener("pointerdown", startDraw);
  vp.addEventListener("pointermove", moveDraw);
  vp.addEventListener("pointerup", endDraw);
  vp.addEventListener("pointercancel", endDraw);
  vp.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 0.9 : 1.1);
  }, { passive: false });
  vp.addEventListener("dblclick", toggleMax);
  vp.addEventListener("dragover", (e) => e.preventDefault());
  vp.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragPreset) dropPreset(e, dragPreset.preset, { src: dragPreset.src, color: dragPreset.type?.color, type_id: dragPreset.type?.id });
    dragPreset = null;
  });
  $("fileImport").addEventListener("change", (e) => {
    [...e.target.files || []].forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        state.photos.push({ id: uid("ph"), src: String(reader.result) });
        save();
        renderPhotos();
      };
      reader.readAsDataURL(file);
    });
  });
  $("btnAddType").addEventListener("click", () => {
    const name = prompt("Type name", "Callout");
    if (!name) return;
    const symbol = prompt("Symbol", "◆") || "◆";
    const kind = prompt("Kind: sticky, textbox, shape, symbol, photo", "shape") || "shape";
    const color = prompt("Color hex", "#E0E7FF") || "#E0E7FF";
    state.types.push({ id: uid("t"), name, kind, symbol, color });
    save();
    renderTypes();
    renderKits();
  });
  $("btnAddSticky").addEventListener("click", () => {
    const title = prompt("Piece title", "New piece");
    if (!title) return;
    state.columns.todo.push({ id: uid("st"), title, body: prompt("Body", "") || "", type_id: state.types[0]?.id });
    save();
    renderColumns();
  });
  $("btnExportMd").addEventListener("click", exportMd);
  $("btnExportDocx").addEventListener("click", exportDocx);
  $("btnExportFigma").addEventListener("click", exportFigma);
  document.querySelectorAll("[data-cmd]").forEach((b) => b.addEventListener("click", () => document.execCommand(b.dataset.cmd, false)));
  $("sessionTitle").addEventListener("change", save);
  $("editor").addEventListener("input", save);
  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("is-max", !!document.fullscreenElement);
    setTimeout(fitView, 150);
  });
  window.addEventListener("resize", () => {
    if (state.section === "sketch") applyView();
  });
}

bind();
renderMedia();
renderPalette();
renderKits();
renderTypes();
renderColumns();
showSection("sketch");
prepCanvases();
fitView();
renderPieces();
setStatus("Studio ready. Mix a color, pick a brush, pinch to zoom, double-tap for full screen.");
