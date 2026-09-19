/* Shared rain + clock + dock for Bots chrome pages. Requires #rain, #clock, #pause, [data-density]. Optional [data-letter]. */
(function () {
  const STEPS = [0.72, 1, 1.38];
  const canvas = document.getElementById("rain");
  if (!canvas || !window.RedRain) return;
  const engine = new window.RedRain.MatrixEngine(canvas);
  let paused = false;
  let density = 1;
  const raw = localStorage.getItem("red-rain-density");
  const n = raw ? Number(raw) : 1;
  if (STEPS.includes(n)) density = n;
  engine.setDensity(density);
  engine.setReducedMotion(matchMedia("(prefers-reduced-motion: reduce)").matches);
  engine.start();
  const ro = new ResizeObserver(function () {
    engine.resize();
  });
  ro.observe(canvas.parentElement || canvas);
  function measure() {
    const zones = [];
    document.querySelectorAll("[data-letter]").forEach(function (el) {
      const r = el.getBoundingClientRect();
      zones.push({ x: r.left, y: r.top, w: r.width, h: r.height });
    });
    engine.setHotZones(zones);
  }
  measure();
  window.addEventListener("resize", measure);
  function point(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener("pointermove", function (e) {
    const p = point(e);
    engine.setPointer(p.x, p.y);
  });
  canvas.addEventListener("pointerleave", function () {
    engine.setPointer(null, null);
  });
  canvas.addEventListener("pointerdown", function (e) {
    const p = point(e);
    engine.burst(p.x, p.y);
  });
  const pauseBtn = document.getElementById("pause");
  function setPaused(next) {
    paused = next;
    engine.setPaused(paused);
    if (!pauseBtn) return;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.setAttribute("aria-label", paused ? "Resume rain" : "Pause rain");
    pauseBtn.textContent = paused ? "Play" : "Pause";
  }
  if (pauseBtn) pauseBtn.addEventListener("click", function () {
    setPaused(!paused);
  });
  document.querySelectorAll("[data-density]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      density = Number(btn.getAttribute("data-density"));
      engine.setDensity(density);
      localStorage.setItem("red-rain-density", String(density));
      document.querySelectorAll("[data-density]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
    });
    btn.setAttribute("aria-pressed", String(Number(btn.getAttribute("data-density")) === density));
  });
  window.addEventListener("keydown", function (e) {
    if (e.code !== "Space") return;
    const t = e.target;
    if (t && (t.tagName === "BUTTON" || t.tagName === "INPUT" || t.tagName === "A")) return;
    e.preventDefault();
    setPaused(!paused);
  });
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function tick() {
    const d = new Date();
    const stamp = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    const el = document.getElementById("clock");
    if (!el) return;
    el.textContent = stamp;
    el.dateTime = stamp;
  }
  tick();
  setInterval(tick, 1000);
})();
