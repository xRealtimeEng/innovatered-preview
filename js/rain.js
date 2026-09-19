/* Homage crimson rain — original RED code, not a studio asset. */
(function () {
  const KANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
  const DIGITS = "0123456789";
  const LATIN = "RED";
  const GLYPHS = Array.from(KANA + DIGITS + LATIN);
  const KANA_COUNT = Array.from(KANA).length;
  const DIGIT_START = KANA_COUNT;
  const LATIN_START = DIGIT_START + DIGITS.length;
  const IDX_R = GLYPHS.lastIndexOf("R");
  const IDX_E = GLYPHS.lastIndexOf("E");
  const IDX_D = GLYPHS.lastIndexOf("D");
  const SPELL = [IDX_R, IDX_E, IDX_D];
  const FONT = '"IBM Plex Sans JP","IPAGothic","DejaVu Sans Mono",monospace';
  const TRAIL = ["#5c1018","#8a1824","#c41e3a","#e4273c","#ff4a58","#ffb4b8","#fff0f0"];
  const HEAD_GLOW = "rgba(255,58,74,0.55)";
  const CLEAR = "#050002";

  function pick() {
    const r = Math.random();
    if (r < 0.52) return DIGIT_START + ((Math.random() * 10) | 0);
    if (r < 0.94) return (Math.random() * KANA_COUNT) | 0;
    return LATIN_START + ((Math.random() * 3) | 0);
  }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function nextGlyph(drop) {
    if (drop.spell >= 0 && drop.spell < SPELL.length) {
      const idx = SPELL[drop.spell];
      drop.spell += 1;
      return idx;
    }
    drop.spell = -1;
    return pick();
  }

  class MatrixEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: false });
      this.atlas = null;
      this.cell = 0;
      this.fontSize = 16;
      this.dpr = 1;
      this.cssW = 0;
      this.cssH = 0;
      this.drops = [];
      this.pointer = null;
      this.hotZones = [];
      this.density = 1;
      this.paused = false;
      this.reduced = false;
      this.raf = 0;
      this.last = 0;
      this.running = false;
      this.destroyed = false;
    }
    setDensity(d) { if (this.density === d) return; this.density = d; this.rebuild(); }
    setPaused(p) { this.paused = p; if (!p && this.running && !this.reduced) this.last = performance.now(); }
    setReducedMotion(r) { this.reduced = r; }
    setPointer(x, y) { this.pointer = x == null || y == null ? null : { x, y }; }
    setHotZones(z) { this.hotZones = z; }
    burst(x, y) {
      for (const drop of this.drops) {
        const d = Math.hypot(drop.x - x, drop.y - y);
        if (d < 160) {
          drop.boost = Math.max(drop.boost, 1.4 - d / 160);
          drop.speed *= 1.15;
          if (d < 80) { drop.y = y + rand(-20, 20); drop.cell = Math.floor(drop.y / this.fontSize); }
        }
      }
    }
    async start() {
      if (this.running || this.destroyed) return;
      this.running = true;
      try {
        await Promise.race([
          document.fonts.load("500 16px " + FONT),
          new Promise((r) => setTimeout(r, 2500)),
        ]);
      } catch (_) {}
      if (this.destroyed) return;
      this.layout();
      this.rebuild();
      if (this.reduced) { this.paintStill(); return; }
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
    destroy() {
      this.destroyed = true;
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.atlas = null;
      this.drops = [];
    }
    resize() {
      const pw = this.cssW, ph = this.cssH;
      this.layout();
      if (this.cssW !== pw || this.cssH !== ph) {
        this.rebuild();
        if (this.reduced) this.paintStill();
      }
    }
    layout() {
      const parent = this.canvas.parentElement || this.canvas;
      const rect = parent.getBoundingClientRect();
      this.cssW = Math.max(1, Math.floor(rect.width));
      this.cssH = Math.max(1, Math.floor(rect.height));
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = Math.floor(this.cssW * this.dpr);
      this.canvas.height = Math.floor(this.cssH * this.dpr);
      this.canvas.style.width = this.cssW + "px";
      this.canvas.style.height = this.cssH + "px";
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
    }
    rebuild() {
      const short = Math.min(this.cssW, this.cssH);
      this.fontSize = Math.max(13, Math.round((short < 500 ? 14 : 16) / Math.pow(this.density, 0.35)));
      this.buildAtlas();
      this.drops = this.spawnLayer(0).concat(this.spawnLayer(1));
      this.ctx.fillStyle = CLEAR;
      this.ctx.fillRect(0, 0, this.cssW, this.cssH);
      for (let i = 0; i < 48; i++) this.step(16);
    }
    spawnLayer(layer) {
      const far = layer === 0;
      const size = far ? this.fontSize * 0.78 : this.fontSize;
      const gap = size * (far ? 1.02 : 0.92);
      const cols = Math.max(10, Math.ceil((this.cssW / gap) * (far ? 0.85 : 1) * Math.max(0.85, this.density)));
      const drops = [];
      for (let i = 0; i < cols; i++) {
        const length = (far ? 12 : 18) + ((Math.random() * (far ? 10 : 16)) | 0);
        const drop = {
          x: ((i + 0.5) / cols) * this.cssW,
          y: rand(-size * 4, this.cssH),
          speed: (far ? 0.03 : 0.052) * rand(0.7, 1.4) * (0.85 + this.density * 0.15),
          length, glyphs: [], cell: 0, boost: 0, spell: Math.random() < 0.1 ? 0 : -1, layer,
        };
        drop.cell = Math.floor(drop.y / size);
        for (let k = 0; k < length; k++) drop.glyphs.push(nextGlyph(drop));
        drops.push(drop);
      }
      return drops;
    }
    buildAtlas() {
      const dpr = this.dpr;
      const cell = Math.ceil(this.fontSize * dpr) + 2;
      this.cell = cell;
      const atlas = document.createElement("canvas");
      atlas.width = GLYPHS.length * cell;
      atlas.height = TRAIL.length * cell;
      const ctx = atlas.getContext("2d");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "500 " + Math.round(this.fontSize * dpr) + "px " + FONT;
      for (let r = 0; r < TRAIL.length; r++) {
        ctx.fillStyle = TRAIL[r];
        for (let c = 0; c < GLYPHS.length; c++) {
          ctx.fillText(GLYPHS[c], (c + 0.5) * cell, (r + 0.5) * cell);
        }
      }
      this.atlas = atlas;
    }
    heat(x, y) {
      let h = 0;
      for (const z of this.hotZones) {
        if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) h = Math.max(h, 0.85);
      }
      if (this.pointer) {
        const d = Math.hypot(x - this.pointer.x, y - this.pointer.y);
        if (d < 150) h = Math.max(h, 1 - d / 150);
      }
      return h;
    }
    tick = (now) => {
      if (!this.running || this.destroyed) return;
      this.raf = requestAnimationFrame(this.tick);
      if (this.paused || document.hidden) { this.last = now; return; }
      const dt = Math.min(34, now - this.last);
      this.last = now;
      this.step(dt);
      this.draw();
    };
    paintStill() {
      for (let i = 0; i < 90; i++) this.step(16);
      this.draw();
    }
    step(dt) {
      for (const drop of this.drops) {
        const size = drop.layer === 0 ? this.fontSize * 0.78 : this.fontSize;
        const heat = this.heat(drop.x, drop.y);
        drop.boost *= 0.92;
        drop.y += drop.speed * (1 + drop.boost + heat * 0.55) * dt * size * 0.085;
        const cell = Math.floor(drop.y / size);
        if (cell !== drop.cell) {
          drop.cell = cell;
          drop.glyphs.unshift(nextGlyph(drop));
          if (drop.glyphs.length > drop.length) drop.glyphs.pop();
          if (drop.spell < 0 && Math.random() < 0.012) drop.spell = 0;
        }
        for (let i = 1; i < drop.glyphs.length; i++) {
          if (Math.random() < 0.035) drop.glyphs[i] = pick();
        }
        if (drop.y - drop.length * size > this.cssH + size) {
          drop.y = rand(-this.cssH * 0.35, -size);
          drop.cell = Math.floor(drop.y / size);
          drop.speed = (drop.layer === 0 ? 0.03 : 0.052) * rand(0.7, 1.4) * (0.85 + this.density * 0.15);
          drop.boost = 0;
          drop.spell = Math.random() < 0.1 ? 0 : -1;
          drop.length = (drop.layer === 0 ? 12 : 18) + ((Math.random() * (drop.layer === 0 ? 10 : 16)) | 0);
        }
      }
    }
    draw() {
      const { ctx, atlas, cell, cssW, cssH, fontSize } = this;
      ctx.fillStyle = CLEAR;
      ctx.fillRect(0, 0, cssW, cssH);
      if (!atlas) return;
      for (const drop of this.drops) {
        const size = drop.layer === 0 ? fontSize * 0.78 : fontSize;
        const far = drop.layer === 0;
        const heat = this.heat(drop.x, drop.y);
        for (let j = 0; j < drop.glyphs.length; j++) {
          const gy = drop.y - j * size;
          if (gy < -size || gy > cssH + size) continue;
          const t = j / Math.max(1, drop.glyphs.length - 1);
          let level = Math.round((1 - t) * (TRAIL.length - 1));
          if (far) level = Math.max(1, level - 1);
          if (heat > 0) level = Math.min(TRAIL.length - 1, level + Math.round(heat * 2));
          if (j === 0) level = TRAIL.length - 1;
          ctx.globalAlpha = far ? 0.62 : 1;
          ctx.drawImage(atlas, drop.glyphs[j] * cell, level * cell, cell, cell, drop.x - size / 2, gy - size / 2, size, size);
        }
        if (!far) {
          const headY = drop.y;
          if (headY > 0 && headY < cssH) {
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.shadowColor = HEAD_GLOW;
            ctx.shadowBlur = 12 + heat * 10;
            ctx.fillStyle = TRAIL[TRAIL.length - 1];
            ctx.font = "500 " + size + "px " + FONT;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(GLYPHS[drop.glyphs[0]] || "0", drop.x, headY);
            ctx.restore();
          }
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  window.RedRain = { MatrixEngine };
})();
