const STORAGE = "red-noteboard-working-v5";
const PAGE_W = 2400;
const PAGE_H = 1800;
const DEVICES = [
  { id: "iphone-16", family: "phone", label: "iPhone 16", w: 393, h: 852, radius: 44 },
  { id: "iphone-16-pro", family: "phone", label: "iPhone 16 Pro", w: 402, h: 874, radius: 46 },
  { id: "iphone-16-pro-max", family: "phone", label: "iPhone 16 Pro Max", w: 440, h: 956, radius: 50 },
  { id: "pixel-9", family: "phone", label: "Pixel 9", w: 412, h: 892, radius: 36 },
  { id: "pixel-9-pro", family: "phone", label: "Pixel 9 Pro", w: 427, h: 952, radius: 38 },
  { id: "galaxy-s24", family: "phone", label: "Galaxy S24", w: 360, h: 780, radius: 32 },
  { id: "galaxy-s24u", family: "phone", label: "Galaxy S24 Ultra", w: 384, h: 824, radius: 22 },
  { id: "ipad-11", family: "tablet", label: "iPad 11", w: 834, h: 1194, radius: 20 },
  { id: "ipad-pro-13", family: "tablet", label: "iPad Pro 13", w: 1032, h: 1376, radius: 22 },
  { id: "galaxy-tab", family: "tablet", label: "Galaxy Tab", w: 800, h: 1280, radius: 16 },
  { id: "laptop-13", family: "desktop", label: "Laptop 13", w: 1280, h: 800, radius: 10 },
  { id: "desktop-1440", family: "desktop", label: "Desktop 1440", w: 1440, h: 900, radius: 8 },
  { id: "desktop-1920", family: "desktop", label: "Desktop 1920", w: 1920, h: 1080, radius: 8 },
];
const BUILT_THEMES = {
  light: { name: "Light", tokens: { accent: "#C8102E", ink: "#0B1C2D", paper: "#FAF8F5", card: "#FFFFFF", alert: "#F2A900", ok: "#1F7A4D", text: "#1A1B22" } },
  dark: { name: "Dark", tokens: { accent: "#FF4D6A", ink: "#F2F3F6", paper: "#14181E", card: "#1E242C", alert: "#F2A900", ok: "#3DDC97", text: "#F2F3F6" } },
  alt1: { name: "Alt 1", tokens: { accent: "#1B6CA8", ink: "#0E1C2F", paper: "#F4F7FB", card: "#FFFFFF", alert: "#E07A3D", ok: "#2A9D8F", text: "#102033" } },
  alt2: { name: "Alt 2", tokens: { accent: "#6B4C9A", ink: "#1A1028", paper: "#F7F4FB", card: "#FFFFFF", alert: "#D4A017", ok: "#2F6B4F", text: "#1A1028" } },
};
const GALLERIES = {
  ui: [
    { kind: "nav", title: "Top navbar", body: "Logo    Map    Assets", w: 320, h: 56, role: "nav", snap: "nav" },
    { kind: "nav", title: "Bottom nav", body: "Home    List    Map", w: 280, h: 56, role: "nav" },
    { kind: "list", title: "Side drawer", body: "Profile\nInbox\nSettings", w: 200, h: 220, role: "list" },
    { kind: "footer", title: "Footer", body: "Demo · not live", w: 320, h: 48, role: "footer", snap: "footer" },
    { kind: "shape", title: "App bar", body: "≡     Title     ○", w: 300, h: 48, role: "nav" },
  ],
  buttons: [
    { kind: "shape", title: "Primary", body: "Continue", w: 160, h: 44, role: "button" },
    { kind: "shape", title: "Secondary", body: "Cancel", w: 140, h: 44, role: "button-ghost" },
    { kind: "shape", title: "Ghost", body: "Learn more", w: 140, h: 40, role: "button-ghost" },
    { kind: "shape", title: "FAB", body: "+", w: 56, h: 56, role: "button" },
    { kind: "shape", title: "Icon", body: "⌕", w: 44, h: 44, role: "button-ghost" },
  ],
  text: [
    { kind: "textbox", title: "Heading", body: "Page title", w: 240, h: 48, role: "label" },
    { kind: "textbox", title: "Body", body: "A short note about this screen.", w: 260, h: 72, role: "label" },
    { kind: "textbox", title: "Label", body: "Field label", w: 140, h: 28, role: "label" },
    { kind: "textbox", title: "Caption", body: "Updated today", w: 140, h: 24, role: "label" },
  ],
  cards: [
    { kind: "card", title: "Metric", body: "Tags in view\n128", w: 180, h: 88, role: "card" },
    { kind: "card", title: "Device", body: "Anchor A1\nOnline", w: 220, h: 84, role: "card" },
    { kind: "card", title: "Activity", body: "Map\nAddress\nDate · time", w: 240, h: 120, role: "card" },
  ],
  forms: [
    { kind: "form", title: "Sign in", body: "Email\nPassword\n[ Continue ]", w: 240, h: 140, role: "form" },
    { kind: "form", title: "Filter", body: "Zone\nAsset type\n[ Apply ]", w: 220, h: 120, role: "form" },
    { kind: "form", title: "Account", body: "Name\nEmail\nPhone", w: 260, h: 120, role: "form" },
  ],
  lists: [
    { kind: "list", title: "Menu", body: "Profile\nInbox\nSettings", w: 200, h: 110, role: "list" },
    { kind: "list", title: "Service rows", body: "Name          Rating\nRow            Row", w: 260, h: 80, role: "list" },
    { kind: "symbol", title: "Alert", body: "Tag left the zone", w: 260, h: 44, role: "alert" },
    { kind: "symbol", title: "Status", body: "Online", w: 96, h: 32, role: "pill" },
  ],
};
const SCREENS = {
  phone: { w: 390, h: 844, label: "Phone" },
  tablet: { w: 834, h: 1194, label: "Tablet" },
  desktop: { w: 1440, h: 900, label: "Desktop" },
};
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

function defaultTheme() {
  return {
    schema: "red-hmi-theme-v1",
    name: "RED RTLS demo",
    tokens: { accent: "#C8102E", ink: "#0B1C2D", paper: "#FAF8F5", card: "#FFFFFF", alert: "#F2A900", ok: "#30A46C" },
    widgets: [
      { kind: "shape", title: "Primary button", body: "Locate asset", w: 168, h: 44, role: "button" },
      { kind: "shape", title: "Secondary button", body: "Clear filters", w: 168, h: 44, role: "button-ghost" },
      { kind: "card", title: "Device card", body: "UWB anchor\nOnline · Floor 1", w: 230, h: 96, role: "card" },
      { kind: "card", title: "Metric card", body: "Tags in view\n128", w: 180, h: 88, role: "card" },
      { kind: "form", title: "Filter form", body: "Zone\nAsset type\n[ Apply ]", w: 240, h: 130, role: "form" },
      { kind: "form", title: "Sign-in form", body: "Email\nPassword\n[ Sign in ]", w: 240, h: 150, role: "form" },
      { kind: "nav", title: "Navbar", body: "RED    Map    Assets    Alerts", snap: "nav", w: 0.92, h: 56, role: "nav" },
      { kind: "footer", title: "Footer", body: "Demo · not live tracking", snap: "footer", w: 0.92, h: 48, role: "footer" },
      { kind: "symbol", title: "Alert banner", body: "Zone B · tag left the geofence", w: 300, h: 48, role: "alert" },
      { kind: "symbol", title: "Status pill", body: "Online", w: 100, h: 32, role: "pill" },
      { kind: "list", title: "Zone list", body: "• Dock\n• Aisle 4\n• Cold room", w: 180, h: 110, role: "list" },
      { kind: "list", title: "Coverage legend", body: "• UWB\n• BLE\n• Wi-Fi", w: 150, h: 96, role: "legend" },
      { kind: "textbox", title: "Floor label", body: "Floor 1 · 3.0 m", w: 200, h: 44, role: "label" },
      { kind: "sticky", title: "Change note", body: "Ask: show last seen", w: 170, h: 84, role: "note" },
      { kind: "shape", title: "FAB", body: "›", w: 56, h: 56, role: "button" },
      { kind: "nav", title: "Bottom nav", body: "Home   List   Map", w: 280, h: 56, role: "nav" },
      { kind: "card", title: "Avatar row", body: "○\nUsername", w: 200, h: 88, role: "card" },
      { kind: "list", title: "Menu rows", body: "Profile\nInbox\nAccount settings\nAdd device\nAdd payment method", w: 220, h: 160, role: "list" },
      { kind: "form", title: "Account card", body: "Full name\nEmail\nDOB    Phone\nStreet address", w: 260, h: 140, role: "form" },
      { kind: "card", title: "Updates card", body: "Updates & activity", w: 280, h: 72, role: "card" },
      { kind: "textbox", title: "Search", body: "Search", w: 200, h: 40, role: "label" },
      { kind: "card", title: "Video tile", body: "Video", w: 160, h: 100, role: "card" },
      { kind: "list", title: "Service rows", body: "Name          Rating\nRow            Row\nRow            Row", w: 280, h: 120, role: "list" },
      { kind: "card", title: "Activity card", body: "Map\nAddress\nDate · time", w: 240, h: 140, role: "card" },
    ],
  };
}
const NOTEBOOK = [
  { id: "bottom-nav", label: "Bottom nav + FAB", pieces: [
    { kind: "textbox", role: "label", title: "Screen", body: "", x: 0.06, y: 0.06, w: 0.88, h: 36 },
    { kind: "nav", role: "nav", title: "Tabs", body: "□   □   □", x: 0.04, y: 0.9, w: 0.72, h: 56 },
    { kind: "shape", role: "button", title: "FAB", body: "›", x: 0.78, y: 0.9, w: 56, h: 56 },
  ]},
  { id: "profile", label: "Profile drawer", pieces: [
    { kind: "card", role: "card", title: "Username", body: "○", x: 0.18, y: 0.04, w: 0.64, h: 88 },
    { kind: "list", role: "list", title: "Menu", body: "Profile\nInbox\nAccount settings\nAdd device\nAdd payment method", x: 0.08, y: 0.2, w: 0.84, h: 200 },
    { kind: "sticky", role: "note", title: "Money", body: "Add credits\nView transactions", x: 0.08, y: 0.52, w: 0.84, h: 72 },
  ]},
  { id: "services", label: "Services drawer", pieces: [
    { kind: "textbox", role: "label", title: "Services", body: "", x: 0.04, y: 0.2, w: 0.22, h: 80 },
    { kind: "shape", role: "button", title: "+", body: "+", x: 0.62, y: 0.04, w: 40, h: 40 },
    { kind: "card", role: "card", title: "Me", body: "○", x: 0.36, y: 0.08, w: 0.28, h: 72 },
    { kind: "list", role: "list", title: "Rows", body: "Item\nItem\nItem\nItem\nItem", x: 0.3, y: 0.22, w: 0.64, h: 280 },
  ]},
  { id: "shell", label: "App shell", pieces: [
    { kind: "shape", role: "button-ghost", title: "Menu", body: "≡", x: 0.04, y: 0.03, w: 44, h: 44 },
    { kind: "shape", role: "button-ghost", title: "User", body: "○", x: 0.78, y: 0.03, w: 44, h: 44 },
    { kind: "card", role: "card", title: "Updates", body: "Updates & activity", x: 0.06, y: 0.42, w: 0.88, h: 72 },
    { kind: "textbox", role: "label", title: "Search", body: "Search", x: 0.2, y: 0.9, w: 0.4, h: 40 },
    { kind: "shape", role: "button", title: "QR", body: "QR", x: 0.78, y: 0.9, w: 52, h: 40 },
  ]},
  { id: "account", label: "Account card", pieces: [
    { kind: "card", role: "card", title: "Username", body: "○", x: 0.28, y: 0.04, w: 0.44, h: 88 },
    { kind: "form", role: "form", title: "Account", body: "Full name     Email\nDOB     Phone\nStreet address", x: 0.06, y: 0.22, w: 0.88, h: 130 },
    { kind: "textbox", role: "label", title: "Account settings", body: "", x: 0.06, y: 0.42, w: 0.7, h: 32 },
  ]},
  { id: "signin", label: "Sign in", pieces: [
    { kind: "textbox", role: "label", title: "Join today", body: "", x: 0.18, y: 0.28, w: 0.64, h: 40 },
    { kind: "shape", role: "button", title: "Continue", body: "Continue", x: 0.12, y: 0.38, w: 0.76, h: 48 },
    { kind: "shape", role: "button-ghost", title: "Sign in another way", body: "Sign in", x: 0.12, y: 0.48, w: 0.76, h: 44 },
  ]},
  { id: "service-list", label: "Service list", pieces: [
    { kind: "textbox", role: "label", title: "Name", body: "Rating", x: 0.06, y: 0.04, w: 0.88, h: 36 },
    { kind: "list", role: "list", title: "Left", body: "Row\nRow\nRow\nRow", x: 0.04, y: 0.12, w: 0.44, h: 200 },
    { kind: "list", role: "list", title: "Right", body: "Row\nRow\nRow", x: 0.52, y: 0.12, w: 0.44, h: 150 },
  ]},
  { id: "activity", label: "Activity card", pieces: [
    { kind: "textbox", role: "label", title: "View title", body: "", x: 0.06, y: 0.04, w: 0.6, h: 32 },
    { kind: "card", role: "card", title: "Stop", body: "Map\nAddress\nDate · time", x: 0.08, y: 0.14, w: 0.84, h: 160 },
    { kind: "card", role: "card", title: "Chart", body: "Activity", x: 0.08, y: 0.4, w: 0.84, h: 80 },
  ]},
];
function applyNotebook(id) {
  const layout = NOTEBOOK.find((n) => n.id === id);
  if (!layout) return;
  state.screen = "phone";
  const fr = frameOf();
  state.pieces = state.pieces.filter((p) => {
    const cx = p.x + (p.w || 0) / 2;
    const cy = p.y + (p.h || 0) / 2;
    return cx < fr.x || cx > fr.x + fr.w || cy < fr.y || cy > fr.y + fr.h;
  });
  layout.pieces.forEach((p) => {
    const w = p.w <= 1 ? Math.round(fr.w * p.w) : p.w;
    const h = p.h <= 1 ? Math.round(fr.h * p.h) : p.h;
    const x = fr.x + (p.x <= 1 ? fr.w * p.x : p.x);
    const y = fr.y + (p.y <= 1 ? fr.h * p.y : p.y);
    placePreset({ kind: p.kind, role: p.role, title: p.title, body: p.body, w, h, snap: null }, { color: tokenColor(p) }, x, y);
  });
  fitView();
  renderPieces();
  setStatus(layout.label + ". Phone frame, top right. Drag still pans.");
}
function renderLayouts() {
  const root = $("layoutKit");
  if (!root) return;
  root.innerHTML = "";
  NOTEBOOK.forEach((n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = n.label;
    b.addEventListener("click", () => applyNotebook(n.id));
    root.appendChild(b);
  });
}
function previewChip(preset) {
  const el = chip(preset, { color: tokenColor(preset) });
  el.classList.add("preview");
  const sample = document.createElement("div");
  sample.className = `sample ${preset.role || preset.kind}`;
  sample.textContent = preset.body || preset.title;
  const cap = document.createElement("small");
  cap.textContent = preset.title;
  el.textContent = "";
  el.append(sample, cap);
  return el;
}
function renderGalleries() {
  Object.entries(GALLERIES).forEach(([key, items]) => {
    const root = $("kit-" + key);
    if (!root) return;
    root.innerHTML = "";
    items.forEach((item) => root.appendChild(previewChip(item)));
  });
}
function renderDevices() {
  const root = $("deviceKit");
  if (!root) return;
  root.innerHTML = "";
  ["phone", "tablet", "desktop"].forEach((family) => {
    const h = document.createElement("p");
    h.className = "section-label";
    h.textContent = family === "phone" ? "Phones" : family === "tablet" ? "Tablets" : "Desktops";
    root.appendChild(h);
    const row = document.createElement("div");
    row.className = "device-row";
    DEVICES.filter((d) => d.family === family).forEach((d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.device = d.id;
      b.className = d.id === state.deviceId ? "is-on" : "";
      b.textContent = d.label;
      b.addEventListener("click", () => selectDevice(d.id));
      row.appendChild(b);
    });
    root.appendChild(row);
  });
}
function selectDevice(id) {
  state.deviceId = id;
  const family = deviceSpec().family;
  state.screen = family === "phone" || family === "tablet" ? family : "desktop";
  save();
  prepCanvases();
  fitView();
  renderDevices();
  setStatus(deviceSpec().label + " drawn on the page.");
}
function renderThemes() {
  const paint = (root, pick) => {
    if (!root) return;
    root.innerHTML = "";
    Object.entries(BUILT_THEMES).forEach(([id, theme]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = id === state.themeId ? "is-on" : "";
      b.innerHTML = `<i style="background:${theme.tokens.paper}"></i><i style="background:${theme.tokens.accent}"></i><i style="background:${theme.tokens.ink}"></i><span>${theme.name}</span>`;
      b.addEventListener("click", () => pick(id));
      root.appendChild(b);
    });
  };
  paint($("builtThemes"), applyBuiltTheme);
  paint($("welcomeThemes"), (id) => {
    state.themeId = id;
    renderThemes();
  });
}
function applyBuiltTheme(id) {
  const built = BUILT_THEMES[id];
  if (!built) return;
  state.themeId = id;
  state.theme.name = built.name;
  state.theme.tokens = Object.assign({}, built.tokens);
  state.color = built.tokens.accent;
  if ($("inkColor")) $("inkColor").value = state.color;
  if ($("themeName")) $("themeName").value = built.name;
  if ($("themeAccent")) $("themeAccent").value = built.tokens.accent;
  document.documentElement.style.setProperty("--paper", built.tokens.paper);
  document.documentElement.style.setProperty("--accent", built.tokens.accent);
  save();
  prepCanvases();
  renderGalleries();
  renderThemes();
  setStatus(built.name + " theme. Tokens are on this device only.");
}
function fillWelcomeDevices() {
  const sel = $("welcomeDevice");
  if (!sel) return;
  sel.innerHTML = "";
  DEVICES.forEach((d) => {
    const o = document.createElement("option");
    o.value = d.id;
    o.textContent = d.label;
    sel.appendChild(o);
  });
  const narrow = window.innerWidth <= 820;
  sel.value = narrow ? "iphone-16" : "desktop-1440";
}
function openWelcome(show) {
  const card = $("welcome");
  if (!card) return;
  card.hidden = !show;
}
function sampleFixture() {
  return {
    schema: "red-hmi-rtls-fixture-v1",
    live_api: false,
    site: "Sample dock",
    devices: [
      { id: "anc-01", type: "uwb-anchor", name: "Anchor A1", status: "online" },
      { id: "anc-02", type: "uwb-anchor", name: "Anchor A2", status: "offline" },
      { id: "gw-01", type: "gateway", name: "Gateway North", status: "online" },
      { id: "tag-14", type: "tag", name: "Pallet 14", status: "moving" },
    ],
    zones: [
      { id: "z-dock", name: "Dock" },
      { id: "z-cold", name: "Cold room" },
    ],
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    session_id: "sess-001",
    session_title: "Untitled HMI",
    section: "sketch",
    screen: "desktop",
    layers: { widgets: true, paint: true, grid: true, labels: true, background: true },
    theme: defaultTheme(),
    backgrounds: {},
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
state.screen = state.screen || "desktop";
state.layers = Object.assign({ widgets: true, paint: true, grid: true, labels: true, background: true }, state.layers || {});
state.deviceId = state.deviceId || "desktop-1440";
state.gridSize = state.gridSize || 12;
state.paperGridSize = state.paperGridSize || 24;
state.os = state.os || "none";
state.homeButton = !!state.homeButton;
state.layers = state.layers || {};
if (state.layers.screenGrid === undefined) state.layers.screenGrid = state.layers.grid !== false;
if (state.layers.paperGrid === undefined) state.layers.paperGrid = true;
state.themeId = state.themeId || "light";
state.theme = state.theme && state.theme.widgets ? state.theme : defaultTheme();
defaultTheme().widgets.forEach((w) => {
  if (!state.theme.widgets.some((have) => have.title === w.title)) state.theme.widgets.push(w);
});
state.backgrounds = state.backgrounds || {};
let selectedId = null;
const bgCache = {};
const view = { x: 0, y: 0, scale: 0.4 };
let media = MEDIA[3];
let drawing = false;
let stroke = null;
let dragPreset = null;
let activePiece = null;
let mode = "pan";
let drawArmed = false;
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
  if ($("themeName") && state.theme) state.theme.name = $("themeName").value.trim() || state.theme.name;
  if ($("themeAccent") && state.theme) state.theme.tokens.accent = $("themeAccent").value;
  try {
    localStorage.setItem(STORAGE, JSON.stringify(state));
    $("status").textContent = "Saved on this device.";
  } catch (_) {
    $("status").textContent = "Not saved. The background image is too large for this browser.";
  }
}
function setStatus(m) {
  $("status").textContent = m;
}

function deviceSpec() {
  return DEVICES.find((d) => d.id === state.deviceId) || DEVICES.find((d) => d.id === "desktop-1440");
}
function frameOf(page) {
  const spec = deviceSpec();
  const pg = page || state.pages.find((p) => p.gx === 0 && p.gy === 0) || state.pages[0];
  return {
    ...spec,
    x: pg.gx * PAGE_W + (PAGE_W - spec.w) / 2,
    y: pg.gy * PAGE_H + (PAGE_H - spec.h) / 2,
  };
}
function applyView() {
  $("world").style.width = worldSize().w + "px";
  $("world").style.height = worldSize().h + "px";
  $("world").style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  const zoom = $("zoomReadout");
  if (zoom) zoom.textContent = `Zoom: ${view.scale.toFixed(1)}x`;
  const name = $("screenName");
  if (name) name.textContent = deviceSpec().label;
  document.querySelectorAll("[data-device]").forEach((b) => b.classList.toggle("is-on", b.dataset.device === state.deviceId));
}
function fitView() {
  alignFrame(frameOf());
}
function alignFrame(fr) {
  const vp = $("viewport").getBoundingClientRect();
  if (vp.width < 40 || vp.height < 40) return;
  const local = toLocal(fr.x, fr.y);
  const margin = fr.family === "desktop" ? 0 : 36;
  if (fr.family === "desktop") {
    view.scale = Math.max(vp.width / fr.w, vp.height / fr.h);
    view.x = -local.x * view.scale;
    view.y = -local.y * view.scale;
  } else {
    const outerW = fr.w + margin * 2;
    const outerH = fr.h + margin * 2;
    view.scale = Math.min(vp.width / outerW, vp.height / outerH);
    view.x = (vp.width - outerW * view.scale) / 2 - (local.x - margin) * view.scale;
    view.y = (vp.height - outerH * view.scale) / 2 - (local.y - margin) * view.scale;
  }
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

function roundPath(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function desktopChrome(fr) {
  if (!fr || fr.family !== "desktop") return { top: 0, bottom: 0 };
  if (state.os === "mac") return { top: 28, bottom: 0 };
  if (state.os === "windows") return { top: 0, bottom: 40 };
  return { top: 0, bottom: 0 };
}
function drawMenuBar(ctx, x, y, w, h) {
  ctx.fillStyle = "rgba(246,246,246,0.94)";
  ctx.fillRect(x, y, w, h);
  ["#FF5F57", "#FEBC2E", "#28C840"].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 16 + i * 16, y + h / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#1A1B22";
  ctx.font = "600 12px DM Sans, sans-serif";
  ctx.fillText("Menu    File    Edit    View", x + 72, y + 18);
}
function drawTaskbar(ctx, x, y, w, h) {
  ctx.fillStyle = "#0B1C2D";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#C8102E";
  roundPath(ctx, x + 10, y + 8, 24, 24, 4);
  ctx.fill();
  ctx.fillStyle = "#2A3439";
  for (let i = 0; i < 4; i++) {
    roundPath(ctx, x + 46 + i * 36, y + 8, 28, 24, 4);
    ctx.fill();
  }
  ctx.fillStyle = "#C5CCD3";
  ctx.font = "12px DM Sans, sans-serif";
  ctx.fillText("12:00", x + w - 52, y + 25);
}
function drawSideButtons(ctx, x, y, fr, bezel) {
  ctx.fillStyle = "#3A424C";
  ctx.fillRect(x - bezel - 3, y + 90, 3, 28);
  ctx.fillRect(x - bezel - 3, y + 128, 3, 46);
  ctx.fillRect(x + fr.w + bezel, y + 110, 3, 64);
}
function closestDevice(width, height, model) {
  const text = String(model || "");
  let pool = DEVICES;
  if (/ipad/i.test(text)) pool = DEVICES.filter((d) => d.family === "tablet" && /ipad/i.test(d.label));
  else if (/iphone/i.test(text)) pool = DEVICES.filter((d) => /iphone/i.test(d.label));
  else if (/pixel/i.test(text)) pool = DEVICES.filter((d) => /pixel/i.test(d.label));
  else if (/sm-|samsung|galaxy/i.test(text)) pool = DEVICES.filter((d) => /galaxy/i.test(d.label));
  if (!pool.length) pool = DEVICES;
  return pool.slice().sort((a, b) => score(a) - score(b))[0];
  function score(d) {
    const turned = (height >= width) !== (d.h >= d.w) ? 4000 : 0;
    return turned + Math.abs(d.w - width) + Math.abs(d.h - height);
  }
}
async function detectDevice() {
  const ok = window.confirm("Match the artboard to this device?\n\nThe browser may ask for platform details. This reads screen size and system name only. It does not read files, photos, or location.");
  if (!ok) {
    setStatus("Device match cancelled. Pick a screen under Page.");
    return;
  }
  let platform = navigator.platform || "";
  let model = "";
  try {
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      const hints = await navigator.userAgentData.getHighEntropyValues(["platform", "model", "platformVersion"]);
      platform = hints.platform || platform;
      model = hints.model || "";
    }
  } catch (_) {
    setStatus("Platform details were blocked. Matching from screen size.");
  }
  const blob = `${platform} ${navigator.userAgent || ""}`;
  if (/win/i.test(blob)) state.os = "windows";
  else if (/mac/i.test(blob)) state.os = "mac";
  else state.os = "none";
  const best = closestDevice(screen.width, screen.height, `${model} ${blob}`);
  selectDevice(best.id);
  markOs();
  setStatus(`Matched ${best.label} from this browser (${screen.width}×${screen.height}). Not a hardware scan. Change it under Page.`);
}
function markOs() {
  document.querySelectorAll("[data-os]").forEach((b) => b.classList.toggle("is-on", b.dataset.os === state.os));
  const home = $("homeButton");
  if (home) home.checked = !!state.homeButton;
}
function prepCanvases() {
  const { w, h } = worldSize();
  ink.width = paper.width = w;
  ink.height = paper.height = h;
  const tokens = (state.theme && state.theme.tokens) || {};
  const paperColor = tokens.paper || "#FAF8F5";
  pctx.fillStyle = paperColor;
  pctx.fillRect(0, 0, w, h);
  const g = grid();
  const darkPaper = (hexToRgb(paperColor)[0] + hexToRgb(paperColor)[1] + hexToRgb(paperColor)[2]) < 380;
  if (state.layers.paperGrid !== false) {
    const paperStep = Number(state.paperGridSize) || 24;
    pctx.strokeStyle = darkPaper ? "rgba(255,255,255,0.08)" : "rgba(15,23,32,0.08)";
    pctx.lineWidth = 1;
    for (let gx = 0; gx < w; gx += paperStep) {
      pctx.beginPath();
      pctx.moveTo(gx, 0);
      pctx.lineTo(gx, h);
      pctx.stroke();
    }
    for (let gy = 0; gy < h; gy += paperStep) {
      pctx.beginPath();
      pctx.moveTo(0, gy);
      pctx.lineTo(w, gy);
      pctx.stroke();
    }
  }
  const step = Number(state.gridSize) || 12;
  state.pages.forEach((pg) => {
    const fr = frameOf(pg);
    const x = fr.x - g.ox;
    const y = fr.y - g.oy;
    const bezel = fr.family === "desktop" ? 0 : 22;
    const chrome = desktopChrome(fr);
    pctx.fillStyle = "#1A1B22";
    roundPath(pctx, x - bezel, y - bezel, fr.w + bezel * 2, fr.h + bezel * 2, (fr.radius || 16) + 8);
    pctx.fill();
    if (fr.family !== "desktop") drawSideButtons(pctx, x, y, fr, bezel);
    pctx.fillStyle = paperColor;
    roundPath(pctx, x, y + chrome.top, fr.w, fr.h - chrome.top - chrome.bottom, fr.family === "desktop" ? 0 : fr.radius || 16);
    pctx.fill();
    const bg = state.backgrounds[pg.id];
    if (bg && state.layers.background !== false && bgCache[bg] && bgCache[bg].complete && bgCache[bg].naturalWidth) {
      pctx.save();
      roundPath(pctx, x, y + chrome.top, fr.w, fr.h - chrome.top - chrome.bottom, 0);
      pctx.clip();
      pctx.drawImage(bgCache[bg], x, y, fr.w, fr.h);
      pctx.restore();
    } else if (bg && state.layers.background !== false && !bgCache[bg]) {
      const img = new Image();
      bgCache[bg] = img;
      img.onload = () => prepCanvases();
      img.src = bg;
    }
    if (chrome.top) drawMenuBar(pctx, x, y, fr.w, chrome.top, state.os);
    if (chrome.bottom) drawTaskbar(pctx, x, y + fr.h - chrome.bottom, fr.w, chrome.bottom);
    if (fr.family === "phone" || (fr.family === "tablet" && !state.homeButton)) {
      pctx.fillStyle = "#111";
      roundPath(pctx, x + fr.w / 2 - 42, y + 12, 84, 18, 9);
      pctx.fill();
      roundPath(pctx, x + fr.w / 2 - 48, y + fr.h - 18, 96, 5, 3);
      pctx.fill();
    }
    if (fr.family === "tablet" && state.homeButton) {
      pctx.strokeStyle = "#C5CCD3";
      pctx.lineWidth = 2;
      pctx.beginPath();
      pctx.arc(x + fr.w / 2, y + fr.h + 11, 7, 0, Math.PI * 2);
      pctx.stroke();
    }
    if (state.layers.screenGrid !== false) {
      pctx.save();
      pctx.beginPath();
      pctx.rect(x, y + chrome.top, fr.w, fr.h - chrome.top - chrome.bottom);
      pctx.clip();
      pctx.strokeStyle = darkPaper ? "rgba(255,255,255,0.16)" : "rgba(15,23,32,0.16)";
      pctx.lineWidth = 1;
      for (let gx = x; gx < x + fr.w; gx += step) {
        pctx.beginPath();
        pctx.moveTo(gx, y);
        pctx.lineTo(gx, y + fr.h);
        pctx.stroke();
      }
      for (let gy = y; gy < y + fr.h; gy += step) {
        pctx.beginPath();
        pctx.moveTo(x, gy);
        pctx.lineTo(x + fr.w, gy);
        pctx.stroke();
      }
      pctx.restore();
    }
    if (state.layers.labels) {
      pctx.fillStyle = tokens.text || "#5C5E6A";
      pctx.font = "600 22px DM Sans, sans-serif";
      pctx.fillText(`${pg.title} · ${fr.label}`, x + 16, y + chrome.top + 28);
    }
  });
  ink.style.display = state.layers.paint ? "block" : "none";
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
    el.className = `piece ${p.kind} ${p.role || ""}${p.id === selectedId ? " is-selected" : ""}`;
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
  root.style.display = state.layers.widgets ? "block" : "none";
  const count = $("pieceCount");
  if (count) count.textContent = `${state.pieces.length} widget${state.pieces.length === 1 ? "" : "s"}`;
  const inspect = $("inspectReadout");
  const sel = state.pieces.find((p) => p.id === selectedId);
  if (inspect) inspect.textContent = sel ? `${sel.kind}: ${sel.title}` : "Nothing selected.";
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
    selectedId = p.id;
    renderPieces();
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

function placePreset(preset, extra, x, y) {
  const piece = {
    id: uid("pc"),
    kind: preset.kind,
    title: preset.title,
    body: preset.body || "",
    x,
    y,
    w: preset.w > 1 ? preset.w : PAGE_W * (preset.w || 0.2),
    h: preset.h || 64,
    snap: preset.snap || null,
    role: preset.role || null,
    color: extra?.color || state.color,
    src: extra?.src,
  };
  if (piece.snap === "nav" || piece.snap === "footer") {
    const cell = nearestPage(x, y) || state.pages[0];
    piece.x = cell.gx * PAGE_W + PAGE_W * 0.04;
    piece.y = cell.gy * PAGE_H + (piece.snap === "nav" ? PAGE_H * 0.04 : PAGE_H * 0.88);
    piece.w = PAGE_W * 0.92;
  }
  state.pieces.push(piece);
  selectedId = piece.id;
  save();
  renderPieces();
  setStatus(`Placed ${piece.title}.`);
}
function dropPreset(evt, preset, extra) {
  const wpt = screenToWorld(evt);
  placePreset(preset, extra, wpt.x - 30, wpt.y - 20);
}

function chip(preset, extra) {
  const el = document.createElement("article");
  el.className = `chip ${preset.kind}`;
  el.draggable = true;
  el.textContent = (preset.symbol ? preset.symbol + " " : "") + preset.title;
  if (extra?.color) el.style.background = extra.color;
  const pack = { preset, extra };
  let fromDrag = false;
  el.addEventListener("dragstart", (e) => {
    fromDrag = true;
    dragPreset = pack;
    e.dataTransfer.setData("text/plain", preset.title);
    e.dataTransfer.effectAllowed = "copy";
  });
  el.addEventListener("click", () => {
    if (fromDrag) {
      fromDrag = false;
      return;
    }
    const fr = frameOf();
    const n = state.pieces.length % 6;
    placePreset(preset, extra, fr.x + 24 + n * 18, fr.y + 40 + n * 18);
  });
  return el;
}
function tokenColor(preset) {
  const t = (state.theme && state.theme.tokens) || {};
  if (preset.role === "button") return t.accent || "#C8102E";
  if (preset.role === "button-ghost") return "#2A3439";
  if (preset.role === "alert") return t.alert || "#F2A900";
  if (preset.role === "pill") return t.ok || "#30A46C";
  if (preset.role === "card" || preset.role === "form") return t.card || "#FFFFFF";
  if (preset.kind === "nav" || preset.kind === "footer") return t.ink || "#0B1C2D";
  return null;
}
function renderKits() {
  $("leftKit").innerHTML = "";
  (state.theme.widgets || []).forEach((p) => $("leftKit").appendChild(chip(p, { color: tokenColor(p) })));
  state.types.forEach((t) => $("leftKit").appendChild(chip({ kind: t.kind, title: t.name, body: t.name, w: 180, h: 80, symbol: t.symbol, role: "note" }, { color: t.color })));
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
  alignFrame(frameOf(pg));
}

function syncCursor() {
  const vp = $("viewport");
  if (!vp) return;
  vp.style.cursor = drawArmed && mode !== "pan" ? "crosshair" : "grab";
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
      drawArmed = m.id !== "pan";
      mode = drawArmed ? "draw" : "pan";
      $("inkWidth").value = String(m.size);
      $("toolFab").textContent = m.label;
      $("toolName").textContent = m.label;
      syncCursor();
      setStatus(drawArmed ? `${m.label} armed. Drag on the frame to draw. Pan tool moves the canvas.` : "Pan. Drag the canvas. Scroll to zoom.");
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
  if (evt.button === 1 || evt.button === 2) return;
  pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY });
  const pen = evt.pointerType === "pen";
  const armed = drawArmed && mode !== "pan";
  if (!(pen || armed) || pointers.size > 1 || evt.shiftKey || evt.altKey) return;
  const w = screenToWorld(evt);
  drawing = true;
  stroke = { media: media.id, color: state.color, size: Number($("inkWidth").value), hard: hardnessMul(), points: [{ x: w.x, y: w.y }] };
}
function moveDraw(evt) {
  const wpt = screenToWorld(evt);
  const fr = frameOf(nearestPage(wpt.x, wpt.y) || state.pages[0]);
  const coords = $("statusCoords");
  if (coords) coords.textContent = `X: ${Math.round(wpt.x - fr.x)}, Y: ${Math.round(wpt.y - fr.y)}`;
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
function closeMenus() {
  $("pageMenu").hidden = true;
  if ($("addMenu")) $("addMenu").hidden = true;
  $("dim").hidden = true;
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
  download(slug(state.session_title) + ".figma-handoff.json", new Blob([JSON.stringify({ schema: "red-noteboard-figma-handoff-v1", live_figma_file: false, live_api: false, theme: state.theme.name, pages: state.pages, pieces: state.pieces.map(({ src, ...rest }) => rest) }, null, 2)], { type: "application/json" }));
}
function readJsonFile(file, onOk) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      onOk(JSON.parse(String(reader.result)));
    } catch (_) {
      setStatus("That file is not JSON.");
    }
  };
  reader.readAsText(file);
}
function exportTheme() {
  save();
  const payload = { schema: "red-hmi-theme-v1", name: state.theme.name, tokens: state.theme.tokens, widgets: state.theme.widgets };
  download(slug(state.theme.name) + ".theme.json", new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  setStatus("Theme file downloaded. It has no live API key.");
}
function applyTheme(data) {
  if (!data || !Array.isArray(data.widgets)) {
    setStatus("Theme needs a widgets list.");
    return;
  }
  state.theme = {
    schema: "red-hmi-theme-v1",
    name: data.name || "Imported theme",
    tokens: Object.assign(defaultTheme().tokens, data.tokens || {}),
    widgets: data.widgets.map((w) => ({
      kind: w.kind || "shape",
      title: w.title || "Preset",
      body: w.body || "",
      w: w.w || 160,
      h: w.h || 48,
      snap: w.snap || null,
      role: w.role || null,
      symbol: w.symbol || "",
    })),
  };
  if ($("themeName")) $("themeName").value = state.theme.name;
  if ($("themeAccent")) $("themeAccent").value = state.theme.tokens.accent;
  save();
  renderKits();
  prepCanvases();
  setStatus(`Theme “${state.theme.name}” loaded. Click a preset to place it.`);
}
function placeFixture(data) {
  if (!data || (!Array.isArray(data.devices) && !Array.isArray(data.zones))) {
    setStatus("Fixture needs devices or zones.");
    return;
  }
  const fr = frameOf();
  let y = fr.y + 48;
  (data.devices || []).forEach((d, i) => {
    placePreset(
      { kind: "card", title: d.name || d.id, body: `${d.type || "device"}\n${d.status || "unknown"} · ${d.id || ""}`, w: 230, h: 84, role: "card" },
      { color: tokenColor({ role: "card" }) },
      fr.x + 24 + (i % 2) * 250,
      y + Math.floor(i / 2) * 96,
    );
  });
  y += Math.ceil((data.devices || []).length / 2) * 96 + 12;
  (data.zones || []).forEach((z, i) => {
    placePreset(
      { kind: "symbol", title: z.name || z.id, body: "Zone", w: 140, h: 40, role: "pill" },
      { color: tokenColor({ role: "pill" }) },
      fr.x + 24 + i * 150,
      y,
    );
  });
  setStatus(`${data.site || "Fixture"} placed. Local rows only. Not a live tag feed.`);
}
function currentPage() {
  return state.pages.find((p) => p.gx === 0 && p.gy === 0) || state.pages[0];
}

function bind() {
  $("sessionTitle").value = state.session_title;
  $("docTitle").value = state.doc_title;
  $("editor").innerHTML = state.doc_html;
  $("inkColor").value = state.color;
  $("hardness").value = String(state.hardness || 72);
  $("toolFab").textContent = media.label;
  if ($("themeName")) $("themeName").value = state.theme.name;
  if ($("themeAccent")) $("themeAccent").value = state.theme.tokens.accent || "#C8102E";
  if ($("gridSize")) $("gridSize").value = String(state.gridSize || 12);
  fillWelcomeDevices();
  renderThemes();
  renderGalleries();
  renderDevices();
  openWelcome(!state.welcomed);
  const welcomeForm = $("welcomeForm");
  if (welcomeForm) {
    welcomeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.session_title = $("welcomeTitle").value.trim() || "Untitled HMI";
      $("sessionTitle").value = state.session_title;
      state.deviceId = $("welcomeDevice").value;
      state.screen = deviceSpec().family === "desktop" ? "desktop" : deviceSpec().family;
      state.layers.grid = $("welcomeGrid").checked;
      state.gridSize = 12;
      state.welcomed = true;
      applyBuiltTheme(state.themeId || "light");
      openWelcome(false);
      if (window.innerWidth > 820) {
        $("leftDrawer").classList.add("is-open");
        $("btnLeft").classList.add("is-on");
      }
      prepCanvases();
      fitView();
      setStatus("Workspace open. Drag a template from the left drawer.");
    });
  }
  const closer = $("btnDrawerClose");
  if (closer) closer.addEventListener("click", () => {
    $("leftDrawer").classList.remove("is-open");
    if ($("dim")) $("dim").hidden = true;
  });
  if ($("gridSize")) $("gridSize").addEventListener("input", () => {
    state.gridSize = Number($("gridSize").value);
    save();
    prepCanvases();
  });
  if ($("paperGridSize")) {
    $("paperGridSize").value = String(state.paperGridSize || 24);
    $("paperGridSize").addEventListener("input", () => {
      state.paperGridSize = Number($("paperGridSize").value);
      save();
      prepCanvases();
    });
  }
  document.querySelectorAll("[data-os]").forEach((b) => {
    b.addEventListener("click", () => {
      state.os = b.dataset.os;
      save();
      markOs();
      prepCanvases();
      setStatus(state.os === "mac" ? "Mac menu bar on desktop frames." : state.os === "windows" ? "Windows taskbar on desktop frames." : "Plain desktop frame.");
    });
  });
  if ($("homeButton")) {
    $("homeButton").addEventListener("change", () => {
      state.homeButton = $("homeButton").checked;
      save();
      prepCanvases();
    });
  }
  if ($("btnDetect")) $("btnDetect").addEventListener("click", () => detectDevice());
  markOs();
  document.querySelectorAll("[data-token]").forEach((b) => {
    b.addEventListener("click", () => {
      state.theme.tokens[b.dataset.token] = $("inkColor").value;
      if (b.dataset.token === "accent" && $("themeAccent")) $("themeAccent").value = $("inkColor").value;
      document.documentElement.style.setProperty("--accent", state.theme.tokens.accent);
      document.documentElement.style.setProperty("--paper", state.theme.tokens.paper);
      save();
      prepCanvases();
      renderGalleries();
      setStatus("Theme token updated from the paint color.");
    });
  });
  document.querySelectorAll("[data-section]").forEach((b) => b.addEventListener("click", () => showSection(b.dataset.section)));
  $("btnPages").addEventListener("click", (e) => {
    e.stopPropagation();
    $("pageMenu").hidden = !$("pageMenu").hidden;
    $("btnPages").classList.toggle("is-on", !$("pageMenu").hidden);
  });
  $("btnLeft").addEventListener("click", () => {
    const open = !$("leftDrawer").classList.contains("is-open");
    $("leftDrawer").classList.toggle("is-open", open);
    $("btnLeft").classList.toggle("is-on", open);
    if (window.innerWidth <= 820) $("dim").hidden = !open;
  });
  $("btnRight").addEventListener("click", () => {
    const open = !$("rightDrawer").classList.contains("is-open");
    $("rightDrawer").classList.toggle("is-open", open);
    $("btnRight").classList.toggle("is-on", open);
    if (window.innerWidth <= 820) $("dim").hidden = !open;
  });
  $("dim").addEventListener("click", () => {
    if (window.innerWidth <= 820) {
      $("leftDrawer").classList.remove("is-open");
      $("rightDrawer").classList.remove("is-open");
    }
    closeMenus();
  });
  document.querySelectorAll(".ltab").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".ltab").forEach((x) => x.classList.toggle("is-on", x === b));
      document.querySelectorAll(".ltab-panel").forEach((p) => {
        const on = p.dataset.lpanel === b.dataset.ltab;
        p.classList.toggle("is-on", on);
        p.hidden = !on;
      });
    });
  });
  document.querySelectorAll("[data-screen]").forEach((b) => {
    b.addEventListener("click", () => {
      state.screen = b.dataset.screen;
      save();
      prepCanvases();
      fitView();
      setStatus(`${SCREENS[state.screen].label} frame.`);
    });
  });
  document.querySelectorAll("[data-layer]").forEach((box) => {
    box.checked = state.layers[box.dataset.layer] !== false;
    box.addEventListener("change", () => {
      state.layers[box.dataset.layer] = box.checked;
      save();
      prepCanvases();
      renderPieces();
    });
  });
  const addScreen = () => {
    const title = prompt("Screen name", `Screen ${state.pages.length + 1}`);
    if (!title) return;
    addPage("right");
    state.pages[state.pages.length - 1].title = title;
    save();
    prepCanvases();
    renderKits();
  };
  $("actNew").addEventListener("click", addScreen);
  $("actNewSide").addEventListener("click", addScreen);
  $("actRename").addEventListener("click", () => {
    $("pageMenu").hidden = true;
    $("sessionTitle").focus();
    $("sessionTitle").select();
  });
  $("btnDeletePiece").addEventListener("click", () => {
    if (!selectedId) return;
    state.pieces = state.pieces.filter((p) => p.id !== selectedId);
    selectedId = null;
    save();
    renderPieces();
  });
  $("widgetSearch").addEventListener("input", () => {
    const q = $("widgetSearch").value.trim().toLowerCase();
    document.querySelectorAll(".chip").forEach((c) => {
      c.style.display = !q || c.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
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
  $("btnExportTheme").addEventListener("click", exportTheme);
  $("btnResetTheme").addEventListener("click", () => applyTheme(defaultTheme()));
  $("themeAccent").addEventListener("input", () => {
    state.theme.tokens.accent = $("themeAccent").value;
    save();
    renderKits();
  });
  $("themeName").addEventListener("change", save);
  $("btnAddPreset").addEventListener("click", () => {
    const title = prompt("Preset name", "Call button");
    if (!title) return;
    const kind = prompt("Kind: shape, card, form, list, textbox, sticky, nav, footer", "shape") || "shape";
    state.theme.widgets.push({ kind, title, body: prompt("Label", title) || title, w: 180, h: 56, role: kind === "shape" ? "button" : kind });
    save();
    renderKits();
  });
  $("themeImport").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) readJsonFile(file, applyTheme);
    e.target.value = "";
  });
  $("fixtureImport").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) readJsonFile(file, placeFixture);
    e.target.value = "";
  });
  $("btnSampleFixture").addEventListener("click", () => placeFixture(sampleFixture()));
  $("bgImport").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const page = currentPage();
      state.backgrounds[page.id] = String(reader.result);
      state.layers.background = true;
      try {
        save();
        prepCanvases();
        setStatus("Background set on this screen. Floorplan or site photo. Local only.");
      } catch (_) {
        delete state.backgrounds[page.id];
        setStatus("That image is too large for this browser. Use a smaller photo.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  });
  document.querySelectorAll("[data-cmd]").forEach((b) => b.addEventListener("click", () => document.execCommand(b.dataset.cmd, false)));
  $("sessionTitle").addEventListener("change", save);
  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("is-max", !!document.fullscreenElement);
    setTimeout(fitView, 120);
  });
}

try {
  bind();
  drawWheel();
  paintMixWells();
  renderMedia();
  renderKits();
  renderLayouts();
  renderTypes();
  renderColumns();
  prepCanvases();
  fitView();
  renderPieces();
  syncCursor();
  if (window.innerWidth > 820 && state.welcomed) {
    $("leftDrawer").classList.add("is-open");
    $("btnLeft").classList.add("is-on");
  }
  requestAnimationFrame(() => fitView());
} catch (err) {
  const status = document.getElementById("status");
  if (status) status.textContent = "Studio hit an error: " + err.message;
  const card = document.getElementById("welcome");
  if (card) card.hidden = false;
}
window.addEventListener("resize", () => {
  if (state.section === "sketch") fitView();
});
if (state.welcomed) setStatus("Drag the canvas to pan. Scroll to zoom. Open Workspace to change the page.");
