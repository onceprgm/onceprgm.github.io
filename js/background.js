(function background() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.querySelector(".bg-fx");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const rand = (a, b) => a + Math.random() * (b - a);
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  resize();
  addEventListener("resize", resize);

  function spawnDust() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.4, 1.8) * dpr,
      vx: rand(-0.06, 0.06) * dpr,
      vy: rand(-0.22, -0.04) * dpr, // slow upward drift
      base: rand(0.12, 0.6), // peak opacity
      tw: rand(0, Math.PI * 2), // twinkle phase
      tws: rand(0.004, 0.022), // twinkle speed
      accent: Math.random() < 0.07, // rare red ember
    };
  }
  const COUNT = Math.round((innerWidth * innerHeight) / 22000);
  const dust = Array.from({ length: Math.max(28, COUNT) }, spawnDust);

  let shooters = [];
  let nextShoot = performance.now() + rand(2500, 5500);
  function spawnShooter() {
    const fromLeft = Math.random() < 0.5;
    const ang = rand(0.12, 0.38);
    const speed = rand(7, 12) * dpr;
    return {
      x: fromLeft ? -60 : w + 60,
      y: rand(h * 0.04, h * 0.55),
      vx: Math.cos(ang) * speed * (fromLeft ? 1 : -1),
      vy: Math.sin(ang) * speed,
      life: 1,
      len: rand(120, 240) * dpr,
    };
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);

    for (const p of dust) {
      p.x += p.vx;
      p.y += p.vy;
      p.tw += p.tws;
      if (p.y < -12) {
        p.y = h + 12;
        p.x = Math.random() * w;
      }
      if (p.x < -12) p.x = w + 12;
      else if (p.x > w + 12) p.x = -12;

      const a = p.base * (0.45 + 0.55 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.fillStyle = p.accent ? `rgba(255,61,46,${a})` : `rgba(255,255,255,${a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (t > nextShoot) {
      shooters.push(spawnShooter());
      nextShoot = t + rand(3500, 8500);
    }
    for (const s of shooters) {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.011;
      const inv = s.len / Math.hypot(s.vx, s.vy);
      const tx = s.x - s.vx * inv;
      const ty = s.y - s.vy * inv;
      const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * s.life})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5 * dpr;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.9 * s.life})`;
      ctx.arc(s.x, s.y, 1.6 * dpr, 0, Math.PI * 2);
      ctx.fill();
      if (s.life <= 0 || s.x < -120 || s.x > w + 120 || s.y > h + 120) s.life = 0;
    }
    shooters = shooters.filter((s) => s.life > 0);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
