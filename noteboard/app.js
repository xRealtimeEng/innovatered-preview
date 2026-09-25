const STORAGE = "red-noteboard-working-v1";
const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const seedCards = {
  todo: [
    { id: "st-login", title: "Sign-in strip", body: "Customer asked for a quiet login, not a wall of SSO." },
    { id: "st-photo", title: "Import paper photo", body: "Photograph the napkin sketch in the meeting." },
  ],
  doing: [
    { id: "st-frame", title: "Tablet drawing frame", body: "Stylus first. Mouse still works on desktop." },
  ],
  done: [
    { id: "st-name", title: "Name the object board_session", body: "IDs not titles as keys." },
  ],
};

const defaultDoc = `<h2>Walkthrough notes</h2>
<p>What the customer drew. What they asked to change. What we will build next.</p>
<ul><li>Keep the frame on the table.</li><li>Drop a sticky when a feature is named.</li></ul>`;

const state = loadState();
let tool = "pen";
let drawing = false;
let currentStroke = null;
let shapeDraft = null;
let dragSticky = null;
let pinDrag = null;

const $ = (id) => document.getElementById(id);
const ink = $("ink");
const paper = $("paper");
const inkCtx = ink.getContext("2d");
const paperCtx = paper.getContext("2d");
const statusEl = $("status");

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    session_id: "sess-001",
    session_title: "Customer walkthrough",
    paper_image: null,
    strokes: [],
    shapes: [],
    columns: structuredClone(seedCards),
    pins: [],
    doc_id: "doc-001",
    doc_title: "Meeting notes",
    doc_html: defaultDoc,
  };
}

function save() {
  state.session_title = $("sessionTitle").value.trim() || "Untitled session";
  state.doc_title = $("docTitle").value.trim() || "Meeting notes";
  state.doc_html = $("editor").innerHTML;
  localStorage.setItem(STORAGE, JSON.stringify(state));
  statusEl.textContent = "Saved on this device.";
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function resizeCanvases() {
  const frame = $("frame");
  const rect = frame.getBoundingClientRect();
  for (const c of [ink, paper]) {
    c.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
    c.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    c.style.width = `${rect.width}px`;
    c.style.height = `${rect.height}px`;
  }
  redraw();
}

function framePoint(evt) {
  const r = ink.getBoundingClientRect();
  return {
    x: ((evt.clientX - r.left) / r.width) * ink.width,
    y: ((evt.clientY - r.top) / r.height) * ink.height,
    cssX: evt.clientX - r.left,
    cssY: evt.clientY - r.top,
    cssW: r.width,
    cssH: r.height,
  };
}

function redraw() {
  paperCtx.clearRect(0, 0, paper.width, paper.height);
  inkCtx.clearRect(0, 0, ink.width, ink.height);
  if (state.paper_image) {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(paper.width / img.width, paper.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      paperCtx.globalAlpha = 0.72;
      paperCtx.drawImage(img, (paper.width - w) / 2, (paper.height - h) / 2, w, h);
      paperCtx.globalAlpha = 1;
    };
    img.src = state.paper_image;
  }
  for (const s of state.strokes) {
    inkCtx.strokeStyle = s.color;
    inkCtx.lineWidth = s.width * devicePixelRatio;
    inkCtx.lineCap = "round";
    inkCtx.lineJoin = "round";
    inkCtx.globalCompositeOperation = s.erase ? "destination-out" : "source-over";
    inkCtx.beginPath();
    s.points.forEach((p, i) => (i ? inkCtx.lineTo(p.x, p.y) : inkCtx.moveTo(p.x, p.y)));
    inkCtx.stroke();
  }
  inkCtx.globalCompositeOperation = "source-over";
  for (const sh of state.shapes) {
    inkCtx.strokeStyle = sh.color;
    inkCtx.lineWidth = 3 * devicePixelRatio;
    const x = sh.x * ink.width;
    const y = sh.y * ink.height;
    const w = sh.w * ink.width;
    const h = sh.h * ink.height;
    if (sh.kind === "rect") inkCtx.strokeRect(x, y, w, h);
    if (sh.kind === "ellipse") {
      inkCtx.beginPath();
      inkCtx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
      inkCtx.stroke();
    }
  }
  renderPins();
}

function renderColumns() {
  const root = $("columns");
  root.innerHTML = "";
  for (const col of COLUMNS) {
    const wrap = document.createElement("section");
    wrap.className = "column";
    wrap.dataset.col = col.id;
    wrap.innerHTML = `<h3>${col.title} · ${state.columns[col.id].length}</h3>`;
    wrap.addEventListener("dragover", (e) => e.preventDefault());
    wrap.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/sticky-id");
      if (id) moveCard(id, col.id);
    });
    for (const card of state.columns[col.id]) {
      const el = document.createElement("article");
      el.className = "card";
      el.draggable = true;
      el.dataset.id = card.id;
      el.dataset.col = col.id;
      el.innerHTML = `<strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.body)}</small>`;
      el.addEventListener("dragstart", (e) => {
        dragSticky = card;
        e.dataTransfer.setData("text/sticky-id", card.id);
        e.dataTransfer.effectAllowed = "copyMove";
      });
      el.addEventListener("pointerdown", () => {
        dragSticky = card;
      });
      wrap.appendChild(el);
    }
    root.appendChild(wrap);
  }
}

function renderPins() {
  const root = $("pins");
  root.innerHTML = "";
  const rect = $("frame").getBoundingClientRect();
  for (const pin of state.pins) {
    const el = document.createElement("article");
    el.className = "pin";
    el.style.left = `${pin.x * rect.width}px`;
    el.style.top = `${pin.y * rect.height}px`;
    el.innerHTML = `<strong>${escapeHtml(pin.title)}</strong><small>${escapeHtml(pin.body)}</small>`;
    el.addEventListener("pointerdown", (e) => {
      pinDrag = { id: pin.id, dx: e.clientX, dy: e.clientY, ox: pin.x, oy: pin.y };
      el.setPointerCapture(e.pointerId);
      e.stopPropagation();
    });
    root.appendChild(el);
  }
}

function moveCard(id, columnId) {
  let found = null;
  for (const col of COLUMNS) {
    const idx = state.columns[col.id].findIndex((c) => c.id === id);
    if (idx >= 0) {
      found = state.columns[col.id].splice(idx, 1)[0];
      break;
    }
  }
  if (!found) return;
  state.columns[columnId].push(found);
  save();
  renderColumns();
}

function addSticky() {
  const title = prompt("Sticky title", "New feature");
  if (!title) return;
  const body = prompt("What to change", "") || "";
  state.columns.todo.push({ id: uid("st"), title: title.trim(), body: body.trim() });
  save();
  renderColumns();
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">");
}

function startInk(evt) {
  if (evt.target.closest(".pin")) return;
  const p = framePoint(evt);
  if (tool === "pen" || tool === "eraser") {
    drawing = true;
    currentStroke = {
      color: $("inkColor").value,
      width: Number($("inkWidth").value),
      erase: tool === "eraser",
      points: [{ x: p.x, y: p.y }],
    };
    ink.setPointerCapture(evt.pointerId);
  } else if (tool === "rect" || tool === "ellipse") {
    drawing = true;
    shapeDraft = { kind: tool, color: $("inkColor").value, x0: p.x / ink.width, y0: p.y / ink.height, x1: p.x / ink.width, y1: p.y / ink.height };
    ink.setPointerCapture(evt.pointerId);
  }
}

function moveInk(evt) {
  if (pinDrag) {
    const r = $("frame").getBoundingClientRect();
    const pin = state.pins.find((x) => x.id === pinDrag.id);
    if (pin) {
      pin.x = Math.min(0.82, Math.max(0, pinDrag.ox + (evt.clientX - pinDrag.dx) / r.width));
      pin.y = Math.min(0.82, Math.max(0, pinDrag.oy + (evt.clientY - pinDrag.dy) / r.height));
      renderPins();
    }
    return;
  }
  if (!drawing) return;
  const p = framePoint(evt);
  if (currentStroke) {
    currentStroke.points.push({ x: p.x, y: p.y });
    redraw();
    inkCtx.strokeStyle = currentStroke.color;
    inkCtx.lineWidth = currentStroke.width * devicePixelRatio;
    inkCtx.lineCap = "round";
    inkCtx.globalCompositeOperation = currentStroke.erase ? "destination-out" : "source-over";
    const pts = currentStroke.points;
    inkCtx.beginPath();
    inkCtx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((pt) => inkCtx.lineTo(pt.x, pt.y));
    inkCtx.stroke();
    inkCtx.globalCompositeOperation = "source-over";
  }
  if (shapeDraft) {
    shapeDraft.x1 = p.x / ink.width;
    shapeDraft.y1 = p.y / ink.height;
  }
}

function endInk(evt) {
  if (pinDrag) {
    pinDrag = null;
    save();
    return;
  }
  const p = framePoint(evt);
  if (dragSticky && tool !== "pen") {
    // drop if released on frame
  }
  if (currentStroke && currentStroke.points.length > 1) {
    state.strokes.push(currentStroke);
  }
  if (shapeDraft) {
    const x = Math.min(shapeDraft.x0, shapeDraft.x1);
    const y = Math.min(shapeDraft.y0, shapeDraft.y1);
    const w = Math.abs(shapeDraft.x1 - shapeDraft.x0);
    const h = Math.abs(shapeDraft.y1 - shapeDraft.y0);
    if (w > 0.01 && h > 0.01) {
      state.shapes.push({ id: uid("sh"), kind: shapeDraft.kind, color: shapeDraft.color, x, y, w, h });
    }
  }
  currentStroke = null;
  shapeDraft = null;
  drawing = false;
  save();
  redraw();
}

function dropOnFrame(evt) {
  evt.preventDefault();
  const id = evt.dataTransfer?.getData("text/sticky-id");
  const card = id
    ? COLUMNS.map((c) => state.columns[c.id].find((x) => x.id === id)).find(Boolean)
    : dragSticky;
  if (!card) return;
  const r = $("frame").getBoundingClientRect();
  state.pins.push({
    id: uid("pin"),
    sticky_id: card.id,
    title: card.title,
    body: card.body,
    x: Math.min(0.75, Math.max(0.02, (evt.clientX - r.left) / r.width)),
    y: Math.min(0.75, Math.max(0.02, (evt.clientY - r.top) / r.height)),
  });
  dragSticky = null;
  save();
  renderPins();
  setStatus(`Pinned “${card.title}” on the frame.`);
}

function htmlToMarkdown(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const walk = (node) => {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeName === "BR") return "\n";
    const inner = Array.from(node.childNodes).map(walk).join("");
    if (node.nodeName === "H2") return `## ${inner.trim()}\n\n`;
    if (node.nodeName === "P") return `${inner.trim()}\n\n`;
    if (node.nodeName === "LI") return `- ${inner.trim()}\n`;
    if (node.nodeName === "STRONG" || node.nodeName === "B") return `**${inner}**`;
    if (node.nodeName === "EM" || node.nodeName === "I") return `*${inner}*`;
    if (node.nodeName === "UL") return `${inner}\n`;
    return inner;
  };
  return walk(tmp).trim() + "\n";
}

function download(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

function exportMd() {
  save();
  const pins = state.pins.map((p) => `- ${p.title}: ${p.body}`).join("\n") || "- (none yet)";
  const md = `# ${state.doc_title}\n\nSession: ${state.session_title}  \nSession ID: ${state.session_id}\nSKU: Working\n\n## Pinned features\n${pins}\n\n## Notes\n${htmlToMarkdown(state.doc_html)}\n`;
  download(slug(state.doc_title) + ".md", new Blob([md], { type: "text/markdown" }));
  setStatus("Downloaded Markdown.");
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
  const size = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(size);
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
    const local = cat([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0),
      name, data,
    ]);
    const central = cat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0),
      u16(0), u16(0), u16(0), u32(0), u32(offset), name,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const body = cat(locals);
  const dir = cat(centrals);
  const end = cat([
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
    u32(dir.length), u32(body.length), u16(0),
  ]);
  return cat([body, dir, end]);
}

function xmlEscape(s) {
  return String(s).replaceAll("&", "&").replaceAll("<", "<").replaceAll(">", ">");
}

function exportDocx() {
  save();
  const tmp = document.createElement("div");
  tmp.innerHTML = state.doc_html;
  const paras = [];
  const pushText = (text, style) => {
    const clean = xmlEscape(text.replace(/\s+/g, " ").trim());
    if (!clean) return;
    paras.push(
      `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t xml:space="preserve">${clean}</w:t></w:r></w:p>`,
    );
  };
  pushText(state.doc_title, "Title");
  pushText(`Session ${state.session_id} · ${state.session_title} · Working SKU`, "Subtitle");
  tmp.querySelectorAll("h2,p,li").forEach((n) => {
    pushText(n.textContent || "", n.tagName === "H2" ? "Heading2" : "Normal");
  });
  if (state.pins.length) {
    pushText("Pinned features", "Heading2");
    state.pins.forEach((p) => pushText(`${p.title} — ${p.body}`, "Normal"));
  }
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${paras.join("")}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr></w:body>
</w:document>`;
  const types = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  const zip = zipStore([
    { name: "[Content_Types].xml", data: types },
    { name: "_rels/.rels", data: rels },
    { name: "word/document.xml", data: documentXml },
  ]);
  download(slug(state.doc_title) + ".docx", new Blob([zip], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
  setStatus("Downloaded .docx. Word or Google Docs can open it.");
}

function exportFigma() {
  save();
  const spec = {
    schema: "red-noteboard-figma-handoff-v1",
    live_figma_file: false,
    sku: "Working",
    session_id: state.session_id,
    name: state.session_title,
    frame: {
      name: "Meeting frame",
      width: 1200,
      height: 800,
      children: [
        ...state.shapes.map((s) => ({
          id: s.id,
          type: s.kind === "ellipse" ? "ELLIPSE" : "RECTANGLE",
          x: Math.round(s.x * 1200),
          y: Math.round(s.y * 800),
          width: Math.round(s.w * 1200),
          height: Math.round(s.h * 800),
          stroke: s.color,
        })),
        ...state.pins.map((p) => ({
          id: p.id,
          type: "TEXT",
          x: Math.round(p.x * 1200),
          y: Math.round(p.y * 800),
          characters: `${p.title}\n${p.body}`,
          sticky_id: p.sticky_id,
        })),
      ],
    },
    notes_title: state.doc_title,
    next_sku: "Connected writes this spec into a real Figma file after Ben names the plan.",
  };
  download(slug(state.session_title) + ".figma-handoff.json", new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" }));
  setStatus("Downloaded Figma-shaped JSON. Live Figma write is Connected / parked.");
}

function slug(s) {
  return (s || "noteboard").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "noteboard";
}

function bind() {
  $("sessionTitle").value = state.session_title;
  $("docTitle").value = state.doc_title;
  $("editor").innerHTML = state.doc_html;
  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => {
      tool = btn.dataset.tool;
      document.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("is-on", b === btn));
    });
  });
  document.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => document.execCommand(btn.dataset.cmd, false));
  });
  document.querySelectorAll("[data-block]").forEach((btn) => {
    btn.addEventListener("click", () => document.execCommand("formatBlock", false, btn.dataset.block));
  });
  $("btnAddSticky").addEventListener("click", addSticky);
  $("btnImport").addEventListener("click", () => $("fileImport").click());
  $("fileImport").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.paper_image = String(reader.result);
      save();
      redraw();
      setStatus("Paper photo imported. Local only.");
    };
    reader.readAsDataURL(file);
  });
  $("btnClearInk").addEventListener("click", () => {
    state.strokes = [];
    state.shapes = [];
    save();
    redraw();
  });
  $("btnUndo").addEventListener("click", () => {
    if (state.strokes.length) state.strokes.pop();
    else if (state.shapes.length) state.shapes.pop();
    save();
    redraw();
  });
  $("btnExportMd").addEventListener("click", exportMd);
  $("btnExportDocx").addEventListener("click", exportDocx);
  $("btnExportFigma").addEventListener("click", exportFigma);
  $("btnBoard").addEventListener("click", () => document.body.classList.toggle("mode-board"));
  $("btnNotes").addEventListener("click", () => {
    document.body.classList.toggle("mode-notes");
    document.body.classList.remove("mode-board");
  });
  $("sessionTitle").addEventListener("change", save);
  $("docTitle").addEventListener("change", save);
  $("editor").addEventListener("input", () => {
    state.doc_html = $("editor").innerHTML;
    localStorage.setItem(STORAGE, JSON.stringify(state));
  });
  const frame = $("frame");
  frame.addEventListener("pointerdown", startInk);
  frame.addEventListener("pointermove", moveInk);
  frame.addEventListener("pointerup", endInk);
  frame.addEventListener("pointercancel", endInk);
  frame.addEventListener("dragover", (e) => e.preventDefault());
  frame.addEventListener("drop", dropOnFrame);
  window.addEventListener("resize", resizeCanvases);
}

bind();
renderColumns();
resizeCanvases();
setStatus("Working SKU ready. Draw, pin a sticky, write notes.");
