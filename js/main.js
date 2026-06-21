const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

gsap.registerPlugin(ScrollTrigger);

let lenis;
if (!reduceMotion) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map(
      (w) =>
        `<span class="word-wrap" style="display:inline-block;overflow:hidden;"><span class="word">${w}</span></span>`,
    )
    .join(" ");
  return el.querySelectorAll(".word");
}

const clock = document.getElementById("clock");
function tick() {
  if (!clock) return;
  const d = new Date();
  clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
setInterval(tick, 1000);
tick();

(function cursor() {
  const c = document.querySelector(".cursor");
  if (!c || window.matchMedia("(hover: none)").matches) return;
  const dot = c.querySelector(".cursor__dot");
  const ring = c.querySelector(".cursor__ring");
  let mx = innerWidth / 2,
    my = innerHeight / 2,
    rx = mx,
    ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  gsap.ticker.add(() => {
    // ring trails the dot with a bit of lag
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
  });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    const mode = el.getAttribute("data-cursor");
    el.addEventListener("mouseenter", () => c.classList.add(`cursor--${mode}`));
    el.addEventListener("mouseleave", () => c.classList.remove(`cursor--${mode}`));
  });
})();

function runPreloader() {
  return new Promise((resolve) => {
    const pre = document.getElementById("preloader");
    const counter = document.getElementById("counter");
    const bar = document.getElementById("loadBar");
    const state = { v: 0 };

    gsap.to(state, {
      v: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate() {
        const val = Math.round(state.v);
        counter.textContent = val;
        bar.style.width = val + "%";
      },
      onComplete() {
        gsap.to(pre, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          delay: 0.2,
          onComplete: () => {
            pre.style.display = "none";
            resolve();
          },
        });
      },
    });
  });
}

let heroWordGroups = [];

function prepareIntro() {
  gsap.set(".letterbox", { scaleY: 0 });
  gsap.set([".hero__meta", ".hero__footer", ".nav"], { autoAlpha: 0, y: 16 });
  document.querySelectorAll(".hero__title [data-split]").forEach((line) => {
    const words = splitWords(line);
    gsap.set(words, { yPercent: 110 });
    heroWordGroups.push(words);
  });
}

function playIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.to(".letterbox", { scaleY: 1, duration: 0.9, ease: "power4.inOut" }, 0);

  heroWordGroups.forEach((words, i) => {
    tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.4 + i * 0.12);
  });

  tl.to(
    [".hero__meta", ".hero__footer", ".nav"],
    { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 },
    0.9,
  );
}

function scrollScenes() {
  const sBar = document.getElementById("scrollBar");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      sBar.style.width = self.progress * 100 + "%";
    },
  });

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      },
    );
  });

  // about: fade each word from dim to bright as the block scrolls through
  gsap.utils.toArray("[data-reveal-words]").forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(
      words,
      { autoAlpha: 0.12 },
      {
        autoAlpha: 1,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: true },
      },
    );
  });

  gsap.utils.toArray("[data-split-lines] [data-split]").forEach((line) => {
    const words = splitWords(line);
    gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: { trigger: "[data-split-lines]", start: "top 80%" },
      },
    );
  });

  const track = document.getElementById("marquee");
  if (track) {
    gsap.to(track, {
      xPercent: -50,
      ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 1 },
    });
  }

  gsap.utils.toArray(".section-head").forEach((el) => {
    gsap.fromTo(
      el.querySelectorAll("span"),
      { autoAlpha: 0, x: -20 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      },
    );
  });

  gsap.to(".hero__title", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  if (lenis) lenis.stop();

  if (reduceMotion) {
    document.getElementById("preloader").style.display = "none";
    gsap.set(".letterbox", { scaleY: 1 });
    gsap.set([".hero__meta", ".hero__footer", ".nav"], { autoAlpha: 1 });
    document
      .querySelectorAll("[data-split], [data-reveal], [data-reveal-words]")
      .forEach((el) => (el.style.opacity = 1));
    return;
  }

  prepareIntro();
  await runPreloader();
  if (lenis) lenis.start();
  playIntro();
  scrollScenes();
  ScrollTrigger.refresh();
});

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || !document.querySelector(id)) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(id, { offset: -40 });
    else document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});
