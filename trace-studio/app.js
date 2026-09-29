const MODES = [
  {
    id: "exact",
    title: "Exact wrap",
    drop: false,
    blurb: "Same pixels inside an SVG. No quality loss. Not a vector. Not a trace.",
  },
  {
    id: "color",
    title: "Color regions",
    drop: true,
    blurb: "Path fills from quantized colors. Quality drops. A photo will posterize.",
  },
  {
    id: "lines",
    title: "Edge lines",
    drop: true,
    blurb: "Stroke paths from edges. Linework only. Does not replace the photo.",
  },
  {
    id: "both",
    title: "Color + lines",
    drop: true,
    blurb: "Regions plus edges. Still a quality drop vs the source.",
  },
];

const fileEl = document.getElementById("file");
const drop = document.getElementById("drop");
const dropLabel = document.getElementById("dropLabel");
const srcImg = document.getElementById("srcImg");
const srcMeta = document.getElementById("srcMeta");
const modesEl = document.getElementById("modes");
const warn = document.getElementById("warn");
const runBtn = document.getElementById("run");
const dlBtn = document.getElementById("dl");
const jobMeta = document.getElementById("jobMeta");
const outFrame = document.getElementById("outFrame");
const maxEdge = document.getElementById("maxEdge");

let sourceFile = null;
let sourceUrl = null;
let lastSvg = "";
let mode = "exact";

function renderModes() {
  modesEl.innerHTML = MODES.map(
    (m) => `<label class="mode${m.id === mode ? " on" : ""}">
      <input type="radio" name="mode" value="${m.id}" ${m.id === mode ? "checked" : ""} />
      <strong>${m.title}</strong>
      <small>${m.blurb}</small>
    </label>`
  ).join("");
  modesEl.querySelectorAll("input").forEach((el) => {
    el.addEventListener("change", () => {
      mode = el.value;
      renderModes();
      updateWarn();
    });
  });
}

function updateWarn() {
  const m = MODES.find((x) => x.id === mode);
  warn.hidden = !m.drop;
  warn.textContent = m.drop
    ? "Quality drops in this mode. The SVG will not match the photo. That is the lesson from the badge sitting."
    : "";
}

function setFile(f) {
  if (!f || !/^image\/(png|jpeg)$/.test(f.type)) {
    jobMeta.textContent = "PNG or JPEG only.";
    return;
  }
  sourceFile = f;
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = URL.createObjectURL(f);
  srcImg.src = sourceUrl;
  dropLabel.textContent = f.name;
  srcMeta.textContent = `${f.name} · ${Math.round(f.size / 1024)} KB · ${f.type}`;
  runBtn.disabled = false;
  jobMeta.textContent = "Ready.";
}

drop.addEventListener("click", () => fileEl.click());
drop.addEventListener("dragover", (e) => e.preventDefault());
drop.addEventListener("drop", (e) => {
  e.preventDefault();
  setFile(e.dataTransfer.files[0]);
});
fileEl.addEventListener("change", () => setFile(fileEl.files[0]));

function loadImage(url) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

function drawFit(img, max) {
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  return c;
}

function exactSvg(img, dataUrl) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${img.width} ${img.height}" width="${img.width}" height="${img.height}"><image width="${img.width}" height="${img.height}" href="${dataUrl}" xlink:href="${dataUrl}"/></svg>`;
}

function hex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function quantKey(r, g, b, step) {
  const q = (v) => Math.min(255, Math.round(v / step) * step);
  return (q(r) << 16) | (q(g) << 8) | q(b);
}

function colorPaths(canvas) {
  const { width: w, height: h } = canvas;
  const data = canvas.getContext("2d").getImageData(0, 0, w, h).data;
  const step = 32;
  const buckets = new Map();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 16) continue;
      const k = quantKey(data[i], data[i + 1], data[i + 2], step);
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push([x, y]);
    }
  }
  const parts = [];
  for (const [k, pts] of buckets) {
    if (pts.length < 12) continue;
    const r = (k >> 16) & 255;
    const g = (k >> 8) & 255;
    const b = k & 255;
    const runs = [];
    const byRow = new Map();
    for (const [x, y] of pts) {
      if (!byRow.has(y)) byRow.set(y, []);
      byRow.get(y).push(x);
    }
    for (const [y, xs] of byRow) {
      xs.sort((a, b) => a - b);
      let a = xs[0],
        prev = xs[0];
      for (let i = 1; i <= xs.length; i++) {
        const x = xs[i];
        if (x === prev + 1) {
          prev = x;
          continue;
        }
        runs.push(`M${a} ${y}h${prev - a + 1}v1h-${prev - a + 1}z`);
        a = x;
        prev = x;
      }
    }
    if (runs.length) parts.push(`<path fill="${hex(r, g, b)}" d="${runs.join("")}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${parts.join("")}</svg>`;
}

function linePaths(canvas) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d");
  const src = ctx.getImageData(0, 0, w, h).data;
  const mag = new Float32Array(w * h);
  const lum = (i) => src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx =
        -lum(((y - 1) * w + (x - 1)) * 4) +
        lum(((y - 1) * w + (x + 1)) * 4) -
        2 * lum((y * w + (x - 1)) * 4) +
        2 * lum((y * w + (x + 1)) * 4) -
        lum(((y + 1) * w + (x - 1)) * 4) +
        lum(((y + 1) * w + (x + 1)) * 4);
      const gy =
        -lum(((y - 1) * w + (x - 1)) * 4) -
        2 * lum(((y - 1) * w + x) * 4) -
        lum(((y - 1) * w + (x + 1)) * 4) +
        lum(((y + 1) * w + (x - 1)) * 4) +
        2 * lum(((y + 1) * w + x) * 4) +
        lum(((y + 1) * w + (x + 1)) * 4);
      mag[y * w + x] = Math.hypot(gx, gy);
    }
  }
  let cut = 40;
  const edge = new Uint8Array(w * h);
  for (let i = 0; i < mag.length; i++) if (mag[i] > cut) edge[i] = 1;
  const used = new Uint8Array(w * h);
  const nbrs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const paths = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const s = y * w + x;
      if (!edge[s] || used[s]) continue;
      const pts = [[x, y]];
      used[s] = 1;
      let cx = x,
        cy = y;
      let moved = true;
      while (moved && pts.length < 800) {
        moved = false;
        for (const [dx, dy] of nbrs) {
          const nx = cx + dx,
            ny = cy + dy;
          if (nx < 1 || ny < 1 || nx >= w - 1 || ny >= h - 1) continue;
          const j = ny * w + nx;
          if (edge[j] && !used[j]) {
            used[j] = 1;
            pts.push([nx, ny]);
            cx = nx;
            cy = ny;
            moved = true;
            break;
          }
        }
      }
      if (pts.length >= 10) {
        const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
        paths.push(`<path fill="none" stroke="#d8dce0" stroke-width="0.8" d="${d}"/>`);
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:#000">${paths.join("")}</svg>`;
}

function mergeColorLines(colorSvg, lineSvg) {
  const w = colorSvg.match(/width="(\d+)"/)[1];
  const h = colorSvg.match(/height="(\d+)"/)[1];
  const fills = colorSvg.replace(/<\/?svg[^>]*>/g, "");
  const strokes = lineSvg.replace(/<\/?svg[^>]*>/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${fills}${strokes}</svg>`;
}

function showSvg(svg) {
  lastSvg = svg;
  outFrame.innerHTML = svg;
  const inner = outFrame.querySelector("svg");
  if (inner) {
    inner.style.maxWidth = "100%";
    inner.style.maxHeight = "360px";
  }
  dlBtn.disabled = false;
}

runBtn.addEventListener("click", async () => {
  if (!sourceFile || !sourceUrl) return;
  runBtn.disabled = true;
  jobMeta.textContent = "Working…";
  try {
    const img = await loadImage(sourceUrl);
    const cap = Number(maxEdge.value) || 512;
    if (mode === "exact") {
      const dataUrl = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.readAsDataURL(sourceFile);
      });
      showSvg(exactSvg(img, dataUrl));
      jobMeta.textContent = `Exact wrap · ${img.width}×${img.height} · pixels kept · not a vector`;
    } else {
      const canvas = drawFit(img, cap);
      let svg;
      if (mode === "color") svg = colorPaths(canvas);
      else if (mode === "lines") svg = linePaths(canvas);
      else svg = mergeColorLines(colorPaths(canvas), linePaths(canvas));
      showSvg(svg);
      const paths = (svg.match(/<path/g) || []).length;
      const images = (svg.match(/<image/g) || []).length;
      jobMeta.textContent = `${mode} · ${canvas.width}×${canvas.height} · ${paths} paths · ${images} images · quality dropped`;
    }
  } catch (err) {
    jobMeta.textContent = "Failed: " + err.message;
  }
  runBtn.disabled = false;
});

dlBtn.addEventListener("click", () => {
  if (!lastSvg) return;
  const name = (sourceFile ? sourceFile.name.replace(/\.[^.]+$/, "") : "trace") + ".svg";
  const blob = new Blob([lastSvg], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  jobMeta.textContent = `Downloaded ${name}`;
});

renderModes();
updateWarn();
