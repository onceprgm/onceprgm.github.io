(function projectScenes() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const builders = {
    cme: buildCme,
    kdemine: buildKdemine,
    "shorter-links": buildShorter,
    "fishing-game": buildFishing,
  };

  document.querySelectorAll(".project[data-scene]").forEach((node) => {
    const stage = node.querySelector(".project__stage");
    const build = builders[node.dataset.scene];
    if (stage && build) build(stage, node);
  });

  function el(cls) {
    const d = document.createElement("div");
    d.className = cls;
    return d;
  }

  function buildCme(stage) {
    const size = 104;
    const half = size / 2;

    const ground = el("cme-ground");
    ground.style.top = "calc(50% + " + (half - 10) + "px)";
    stage.appendChild(ground);

    const scene = el("cme-scene");
    scene.style.width = size + "px";
    scene.style.height = size + "px";
    const cube = el("cube");
    const inner = el("cube__inner");
    [
      ["top", "rotateX(90deg) translateZ(" + half + "px)"],
      ["bottom", "rotateX(-90deg) translateZ(" + half + "px)"],
      ["front", "translateZ(" + half + "px)"],
      ["back", "rotateY(180deg) translateZ(" + half + "px)"],
      ["right", "rotateY(90deg) translateZ(" + half + "px)"],
      ["left", "rotateY(-90deg) translateZ(" + half + "px)"],
    ].forEach(([n, t]) => {
      const f = el("cube__face cube__face--" + n);
      f.style.transform = t;
      inner.appendChild(f);
    });
    cube.appendChild(inner);
    scene.appendChild(cube);

    const shadow = el("cme-shadow");
    shadow.style.bottom = -half + 22 + "px";
    scene.appendChild(shadow);
    stage.appendChild(scene);

    for (let i = 0; i < 6; i++) {
      const m = el("cme-mote");
      m.style.left = 48 + Math.random() * 32 + "%";
      m.style.bottom = 34 + Math.random() * 14 + "%";
      m.style.animationDelay = (-Math.random() * 6).toFixed(2) + "s";
      m.style.animationDuration = (5 + Math.random() * 4).toFixed(2) + "s";
      stage.appendChild(m);
    }

    const tag = el("cme-readout");
    tag.innerHTML = '<span class="cme-readout__caret"></span> cme ▸ launch world';
    stage.appendChild(tag);
  }

  function buildKdemine(stage) {
    const R = 30;
    const hornCount = 11;

    stage.appendChild(el("kde-murk"));

    [
      [38, 0],
      [57, 1.4],
    ].forEach(([leftPct, delay]) => {
      const r = el("kde-ray");
      r.style.left = leftPct + "%";
      r.style.animationDuration = "9s";
      r.style.animationDelay = -delay + "s";
      stage.appendChild(r);
    });

    for (let i = 0; i < 8; i++) {
      const s = el("kde-snow");
      s.style.left = 40 + Math.random() * 40 + "%";
      s.style.top = Math.random() * 70 + "%";
      s.style.animationDuration = (6 + Math.random() * 5).toFixed(2) + "s";
      s.style.animationDelay = (-Math.random() * 8).toFixed(2) + "s";
      stage.appendChild(s);
    }

    stage.appendChild(el("kde-chain"));

    const scene = el("kde-scene");
    scene.style.width = "120px";
    scene.style.height = "120px";
    const riser = el("kde-riser");
    const wobble = el("kde-wobble");
    const back = el("kde-back");
    const front = el("kde-front");
    const body = el("kde-body");
    body.appendChild(el("kde-seam"));
    body.appendChild(el("kde-spec"));
    body.appendChild(el("kde-lamp"));

    for (let i = 0; i < hornCount; i++) {
      const a = i * (360 / hornCount);
      const isFront = i % 2 === 0;
      const z = isFront ? 18 : -14;
      const horn = el("kde-horn" + (isFront ? "" : " kde-horn--back"));
      horn.style.transform =
        "rotate(" + a.toFixed(1) + "deg) translateY(-" + R + "px) translateZ(" + z + "px)";
      horn.appendChild(el("kde-horn__tip"));
      (isFront ? front : back).appendChild(horn);
    }
    wobble.appendChild(back);
    wobble.appendChild(body);
    wobble.appendChild(front);
    riser.appendChild(wobble);
    scene.appendChild(riser);
    stage.appendChild(scene);

    const tag = el("kde-readout");
    tag.innerHTML = '<span class="kde-readout__caret"></span> kdemine ▸ sonar contact';
    stage.appendChild(tag);

    if (window.gsap) {
      gsap.set(wobble, { rotationY: -18 });
      gsap.to(wobble, { rotationY: 18, duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(wobble, { rotationX: 7, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(wobble, { y: -7, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
  }

  function scramble(node, finalText) {
    const pool = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789";
    const total = 15;
    let frame = 0;
    clearInterval(node._iv);
    node._iv = setInterval(() => {
      frame++;
      const locked = Math.floor((frame / total) * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        out += i < locked ? finalText[i] : pool[Math.floor(Math.random() * pool.length)];
      }
      node.textContent = out;
      if (frame >= total) {
        clearInterval(node._iv);
        node.textContent = finalText;
      }
    }, 45);
  }

  function buildShorter(stage, node) {
    const longUrl = "github.com/onceprgm/";
    const longTail = "shorter-links";
    const finalToken = "a8F2kQ";

    stage.appendChild(el("sl-field"));

    const scene = el("sl-scene");

    const long = el("sl-long");
    const text = longUrl + longTail;
    const charSpans = [];
    for (let i = 0; i < text.length; i++) {
      const s = document.createElement("span");
      s.textContent = text[i];
      if (i >= longUrl.length) s.style.color = "rgba(195,215,232,.92)";
      long.appendChild(s);
      charSpans.push(s);
    }
    scene.appendChild(long);

    const short = el("sl-short");
    const token = document.createElement("span");
    token.className = "sl-token";
    token.textContent = finalToken;
    short.appendChild(document.createTextNode("t.me/sl_bot?start="));
    short.appendChild(token);
    scene.appendChild(short);
    stage.appendChild(scene);

    const tag = el("sl-readout");
    tag.innerHTML = '<span class="sl-readout__caret"></span> shorter-links ▸ link shortened';
    stage.appendChild(tag);

    if (!window.gsap) return;

    gsap.set(short, { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.from(charSpans, { opacity: 0, x: -8, duration: 0.3, stagger: 0.01, ease: "power2.out" }, 0)
      .to(
        long,
        { scaleX: 0.02, opacity: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "power3.in" },
        0.5,
      )
      .fromTo(
        short,
        { opacity: 0, scaleX: 0.02 },
        { opacity: 1, scaleX: 1, duration: 0.46, ease: "power3.out" },
        0.8,
      )
      .call(() => scramble(token, finalToken), null, 0.84)
      .from(tag, { opacity: 0, x: -10, duration: 0.4, ease: "power2.out" }, 0.95);

    node.addEventListener("mouseenter", () => tl.restart());
    node.addEventListener("mouseleave", () => clearInterval(token._iv));
  }

  function buildFishing(stage) {
    stage.appendChild(el("fg-water"));

    [
      [40, 0],
      [60, 1.6],
    ].forEach(([leftPct, delay]) => {
      const r = el("fg-ray");
      r.style.left = leftPct + "%";
      r.style.animationDuration = "10s";
      r.style.animationDelay = -delay + "s";
      stage.appendChild(r);
    });

    for (let i = 0; i < 7; i++) {
      const b = el("fg-bubble");
      const sz = (3 + Math.random() * 4).toFixed(1);
      b.style.width = sz + "px";
      b.style.height = sz + "px";
      b.style.left = 42 + Math.random() * 30 + "%";
      b.style.bottom = 18 + Math.random() * 34 + "%";
      b.style.animationDuration = (4 + Math.random() * 4).toFixed(2) + "s";
      b.style.animationDelay = (-Math.random() * 6).toFixed(2) + "s";
      stage.appendChild(b);
    }

    const line = el("fg-line");
    line.appendChild(el("fg-lure"));
    stage.appendChild(line);

    const scene = el("fg-scene");
    const yaw = el("fg-yaw");
    const cruise = el("fg-cruise");
    const flex = el("fg-flex");
    const fish = el("fg-fish");
    [
      "fg-tail",
      "fg-dorsal",
      "fg-anal",
      "fg-body",
      "fg-spots",
      "fg-gill",
      "fg-pec",
      "fg-eye",
    ].forEach((c) => fish.appendChild(el(c)));
    flex.appendChild(fish);
    cruise.appendChild(flex);
    yaw.appendChild(cruise);
    scene.appendChild(yaw);
    stage.appendChild(scene);

    const tag = el("fg-readout");
    tag.innerHTML = '<span class="fg-readout__caret"></span> fishing-game ▸ fish on';
    stage.appendChild(tag);
  }
})();
