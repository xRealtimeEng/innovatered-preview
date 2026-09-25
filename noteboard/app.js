const STORAGE = "red-noteboard-working-v2";
const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const seedCards = {
  todo: [
    { id: "st-login", title: "Sign-in strip", body: "Quiet login. Not a wall of SSO." },
    { id: "st-photo", title: "Import paper photo", body: "Photograph the napkin in the meeting." },
  ],
  doing: [{ id: "st-frame", title: "Tablet drawing frame", body: "Stylus first. Mouse still works." }],
  done: [{ id: "st-name", title: "Name the object board_session", body: "IDs not titles as keys." }],
};

const defaultDoc = `<h2>Walkthrough notes</h2>
<p>What they drew. What they asked to change. What we build next.</p>
<ul><li>Keep the page open on the table.</li><li>Pin a sticky when a feature is named.</li></ul>`;

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function blankSketch(title) {
  return { id: uid("pg"), title, strokes: [], shapes: [], paper_image: null, pins: [] };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return JSON.parse(raw);
    const old = localStorage.getItem("red-noteboard-working-v1");
    if (old) {
      const o = JSON.parse(old);
      return {
        session_id: o.session_id || "sess-001",
        session_title: o.session_title || "Customer walkthrough",
        section: "sketch",
        sketchPages: [
          {
            id: "pg-sketch-1",
            title: "Page 1",
            strokes: o.strokes || [],
            shapes: o.shapes || [],
            paper_image: o.paper_image || null,
            pins: o.pins || [],
          },
        ],
        sketchIndex: 0,
        notePages: [{ id: o.doc_id || "doc-001", title: o.doc_title || "Meeting notes", html: o.doc_html || defaultDoc }],
        noteIndex: 0,
        columns: o.columns || structuredClone(seedCards),
      };
    }
  } catch (_) {}
  return {
    session_id: "sess-001",
    session_title: "Customer walkthrough",
    section: "sketch",
    sketchPages: [blankSketch("Page 1")],
    sketchIndex: 0,
    notePages: [{ id: "doc-001", title: "Meeting notes", html: defaultDoc }],
    noteIndex: 0,
    columns: structuredClone(seedCards),
  };
}

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

function sketch() {
  return state.sketchPages[state.sketchIndex];
}
function note() {
  return state.notePages[state.noteIndex];
}

function save() {
  state.session_title = $("sessionTitle").value.trim() || "Untitled notebook";
  if ($("docTitle")) note().title = $("docTitle").value.trim() || "Untitled page";
  if ($("editor")) note().html = $("editor").innerHTML;
  localStorage.setItem(STORAGE, JSON.stringify(state));
  $("status").textContent = "Saved on this device.";
}

function setStatus(msg) {
  $("status").textContent = msg;
}

function showSection(name) {
  state.section = name;
  document.querySelectorAll(".stab[data-section]").forEach((b) => b.classList.toggle("is-on", b.dataset.section === name));
  document.querySelectorAll(".view").forEach((v) => {
    const on = v.id === `view-${name}`;
    v.classList.toggle("is-on", on);
    v.hidden = !on;
  });
  renderPages();
  if (name === "sketch") requestAnimationFrame(resizeCanvases);
  if (name === "notes") {
    $("docTitle").value = note().title;
    $("editor").innerHTML = note().html;
  }
  save();
}

function renderPages() {
  const list = $("pageList");
  list.innerHTML = "";
  const rows =
    state.section === "notes"
      ? state.notePages.map((p, i) => ({ title: p.title, on: i === state.noteIndex, go: () => openNote(i) }))
      : state.section === "sketch"
        ? state.sketchPages.map((p, i) => ({ title: p.title, on: i === state.sketchIndex, go: () => openSketch(i) }))
        : [{ title: state.section === "board" ? "Harbor" : "Handoff", on: true, go: () => {} }];
  rows.forEach((row) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "page-tab" + (row.on ? " is-on" : "");
    b.textContent = row.title;
    b.addEventListener("click", row.go);
    list.appendChild(b);
  });
}

function openSketch(i) {
  state.sketchIndex = i;
  showSection("sketch");
  redraw();
}
function openNote(i) {
  if ($("editor")) note().html = $("editor").innerHTML;
  state.noteIndex = i;
  showSection("notes");
}

function addPage() {
  if (state.section === "notes") {
    state.notePages.push({ id: uid("doc"), title: `Notes ${state.notePages.length + 1}`, html: "<p></p>" });
    state.noteIndex = state.notePages.length - 1;
    showSection("notes");
  } else {
    state.sketchPages.push(blankSketch(`Page ${state.sketchPages.length + 1}`));
    state.sketchIndex = state.sketchPages.length - 1;
    showSection("sketch");
  }
  setStatus("New page added.");
}

function resizeCanvases() {
  const frame = $("frame");
  if (!frame || state.section !== "sketch") return;
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
  };
}

function redraw() {
  if (!ink.width) return;
  paperCtx.clearRect(0, 0, paper.width, paper.height);
  inkCtx.clearRect(0, 0, ink.width, ink.height);
  const pg = sketch();
  if (pg.paper_image) {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(paper.width / img.width, paper.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      paperCtx.globalAlpha = 0.78;
      paperCtx.drawImage(img, (paper.width - w) / 2, (paper.height - h) / 2, w, h);
      paperCtx.globalAlpha = 1;
    };
    img.src = pg.paper_image;
  }
  for (const s of pg.strokes) {
    inkCtx.strokeStyle = s.color;
    inkCtx.lineWidth = s.width * devicePixelRatio;
    inkCtx.lineCap = "round";
    inkCtx.lineJoin = "round";
    inkCtx.globalAlpha = s.highlight ? 0.35 : 1;
    inkCtx.globalCompositeOperation = s.erase ? "destination-out" : "source-over";
    inkCtx.beginPath();
    s.points.forEach((p, i) => (i ? inkCtx.lineTo(p.x, p.y) : inkCtx.moveTo(p.x, p.y)));
    inkCtx.stroke();
  }
  inkCtx.globalAlpha = 1;
  inkCtx.globalCompositeOperation = "source-over";
  for (const sh of pg.shapes) {
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

function renderPins() {
  const root = $("pins");
  root.innerHTML = "";
  const rect = $("frame").getBoundingClientRect();
  for (const pin of sketch().pins) {
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

function allCards() {
  return COLUMNS.flatMap((c) => state.columns[c.id].map((card) => ({ ...card, col: c.id })));
}

function renderColumns() {
  const root = $("columns");
  root.innerHTML = "";
  for (const col of COLUMNS) {
    const wrap = document.createElement("section");
    wrap.className = "column";
    wrap.innerHTML = `<h3>${col.title} · ${state.columns[col.id].length}</h3>`;
    wrap.addEventListener("dragover", (e) => e.preventDefault());
    wrap.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/sticky-id");
      if (id) moveCard(id, col.id);
    });
    for (const card of state.columns[col.id]) {
      wrap.appendChild(cardEl(card, col.id));
    }
    root.appendChild(wrap);
  }
  renderTray();
}

function cardEl(card, col) {
  const el = document.createElement("article");
  el.className = "card";
  el.draggable = true;
  el.dataset.id = card.id;
  el.dataset.col = col;
  el.innerHTML = `<strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.body)}</small>`;
  bindDrag(el, card);
  return el;
}

function renderTray() {
  const root = $("trayCards");
  root.innerHTML = "";
  for (const card of allCards()) {
    const el = document.createElement("article");
    el.className = "mini";
    el.draggable = true;
    el.innerHTML = escapeHtml(card.title);
    bindDrag(el, card);
    root.appendChild(el);
  }
}

function bindDrag(el, card) {
  el.addEventListener("dragstart", (e) => {
    dragSticky = card;
    e.dataTransfer.setData("text/sticky-id", card.id);
    e.dataTransfer.effectAllowed = "copyMove";
  });
  el.addEventListener("pointerdown", () => {
    dragSticky = card;
  });
}

function moveCard(id, columnId) {
  let found = null;
  for (const col of COLUMNS) {
    const idx = state.columns[col.id].findIndex((c) => c.id === id);
    if (idx >= 0) found = state.columns[col.id].splice(idx, 1)[0];
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
  if (tool === "pen" || tool === "eraser" || tool === "highlighter") {
    drawing = true;
    currentStroke = {
      color: tool === "highlighter" ? $("inkColor").value : $("inkColor").value,
      width: tool === "highlighter" ? Math.max(14, Number($("inkWidth").value) * 2) : Number($("inkWidth").value),
      erase: tool === "eraser",
      highlight: tool === "highlighter",
      points: [{ x: p.x, y: p.y }],
    };
    ink.setPointerCapture(evt.pointerId);
  } else if (tool === "rect" || tool === "ellipse") {
    drawing = true;
    shapeDraft = {
      kind: tool,
      color: $("inkColor").value,
      x0: p.x / ink.width,
      y0: p.y / ink.height,
      x1: p.x / ink.width,
      y1: p.y / ink.height,
    };
    ink.setPointerCapture(evt.pointerId);
  }
}

function moveInk(evt) {
  if (pinDrag) {
    const r = $("frame").getBoundingClientRect();
    const pin = sketch().pins.find((x) => x.id === pinDrag.id);
    if (pin) {
      pin.x = Math.min(0.8, Math.max(0, pinDrag.ox + (evt.clientX - pinDrag.dx) / r.width));
      pin.y = Math.min(0.8, Math.max(0, pinDrag.oy + (evt.clientY - pinDrag.dy) / r.height));
      renderPins();
    }
    return;
  }
  if (!drawing) return;
  const p = framePoint(evt);
  if (currentStroke) {
    currentStroke.points.push({ x: p.x, y: p.y });
    redraw();
  }
  if (shapeDraft) {
    shapeDraft.x1 = p.x / ink.width;
    shapeDraft.y1 = p.y / ink.height;
  }
}

function endInk() {
  if (pinDrag) {
    pinDrag = null;
    save();
    return;
  }
  if (currentStroke && currentStroke.points.length > 1) sketch().strokes.push(currentStroke);
  if (shapeDraft) {
    const x = Math.min(shapeDraft.x0, shapeDraft.x1);
    const y = Math.min(shapeDraft.y0, shapeDraft.y1);
    const w = Math.abs(shapeDraft.x1 - shapeDraft.x0);
    const h = Math.abs(shapeDraft.y1 - shapeDraft.y0);
    if (w > 0.01 && h > 0.01) {
      sketch().shapes.push({ id: uid("sh"), kind: shapeDraft.kind, color: shapeDraft.color, x, y, w, h });
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
  const card = id ? allCards().find((c) => c.id === id) : dragSticky;
  if (!card) return;
  const r = $("frame").getBoundingClientRect();
  sketch().pins.push({
    id: uid("pin"),
    sticky_id: card.id,
    title: card.title,
    body: card.body,
    x: Math.min(0.72, Math.max(0.08, (evt.clientX - r.left) / r.width)),
    y: Math.min(0.72, Math.max(0.08, (evt.clientY - r.top) / r.height)),
  });
  dragSticky = null;
  save();
  renderPins();
  setStatus(`Pinned “${card.title}”.`);
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

function slug(s) {
  return (s || "noteboard").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "noteboard";
}

function exportMd() {
  save();
  const pins = sketch().pins.map((p) => `- ${p.title}: ${p.body}`).join("\n") || "- (none yet)";
  const md = `# ${note().title}\n\nNotebook: ${state.session_title}  \nSession ID: ${state.session_id}\nSKU: Working\n\n## Pinned features\n${pins}\n\n## Notes\n${htmlToMarkdown(note().html)}\n`;
  download(slug(note().title) + ".md", new Blob([md], { type: "text/markdown" }));
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
  tmp.innerHTML = note().html;
  const paras = [];
  const pushText = (text, style) => {
    const clean = xmlEscape(text.replace(/\s+/g, " ").trim());
    if (!clean) return;
    paras.push(
      `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t xml:space="preserve">${clean}</w:t></w:r></w:p>`,
    );
  };
  pushText(note().title, "Title");
  pushText(`Notebook ${state.session_id} · ${state.session_title} · Working SKU`, "Subtitle");
  tmp.querySelectorAll("h2,p,li").forEach((n) => {
    pushText(n.textContent || "", n.tagName === "H2" ? "Heading2" : "Normal");
  });
  if (sketch().pins.length) {
    pushText("Pinned features", "Heading2");
    sketch().pins.forEach((p) => pushText(`${p.title} — ${p.body}`, "Normal"));
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
  download(slug(note().title) + ".docx", new Blob([zip], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
  setStatus("Downloaded .docx.");
}

function exportFigma() {
  save();
  const pg = sketch();
  const spec = {
    schema: "red-noteboard-figma-handoff-v1",
    live_figma_file: false,
    sku: "Working",
    session_id: state.session_id,
    name: state.session_title,
    page: pg.title,
    frame: {
      name: pg.title,
      width: 1200,
      height: 800,
      children: [
        ...pg.shapes.map((s) => ({
          id: s.id,
          type: s.kind === "ellipse" ? "ELLIPSE" : "RECTANGLE",
          x: Math.round(s.x * 1200),
          y: Math.round(s.y * 800),
          width: Math.round(s.w * 1200),
          height: Math.round(s.h * 800),
          stroke: s.color,
        })),
        ...pg.pins.map((p) => ({
          id: p.id,
          type: "TEXT",
          x: Math.round(p.x * 1200),
          y: Math.round(p.y * 800),
          characters: `${p.title}\n${p.body}`,
          sticky_id: p.sticky_id,
        })),
      ],
    },
    notes_title: note().title,
    next_sku: "Connected writes this spec into a real Figma file after Ben names the plan.",
  };
  download(slug(state.session_title) + ".figma-handoff.json", new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" }));
  setStatus("Downloaded Figma-shaped JSON. Live write is parked.");
}

function bind() {
  $("sessionTitle").value = state.session_title;
  $("docTitle").value = note().title;
  $("editor").innerHTML = note().html;
  document.querySelectorAll(".stab[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });
  $("btnAddSection").addEventListener("click", () => {
    setStatus("Working keeps Sketch, Stickies, Notes, and Handoff. Extra sections wait for Custom.");
  });
  $("btnAddPage").addEventListener("click", addPage);
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
      sketch().paper_image = String(reader.result);
      save();
      redraw();
      setStatus("Paper photo imported. Local only.");
    };
    reader.readAsDataURL(file);
  });
  $("btnClearInk").addEventListener("click", () => {
    sketch().strokes = [];
    sketch().shapes = [];
    save();
    redraw();
  });
  $("btnUndo").addEventListener("click", () => {
    const pg = sketch();
    if (pg.strokes.length) pg.strokes.pop();
    else if (pg.shapes.length) pg.shapes.pop();
    save();
    redraw();
  });
  $("btnExportMd").addEventListener("click", exportMd);
  $("btnExportDocx").addEventListener("click", exportDocx);
  $("btnExportFigma").addEventListener("click", exportFigma);
  $("sessionTitle").addEventListener("change", save);
  $("docTitle").addEventListener("change", save);
  $("editor").addEventListener("input", () => {
    note().html = $("editor").innerHTML;
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
showSection(state.section || "sketch");
resizeCanvases();
setStatus("Notebook ready. Sketch is the paper. Stickies and Notes have their own tabs.");
