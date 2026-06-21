# onceprgm - personal site

A cinematic one-page personal site: hero, about, selected work and contact,
with a film-grain look, smooth scrolling and scroll-driven animation.

No build step - plain HTML, CSS and JavaScript. Libraries are loaded from a CDN.

## Stack

- Vanilla HTML / CSS / JS
- [GSAP](https://gsap.com/) + ScrollTrigger - intro and scroll animation
- [Lenis](https://github.com/darkroomengineering/lenis) - smooth scroll
- Canvas - ambient drifting dust and shooting stars

## Run locally

Any static server works; the fonts and CDN scripts behave best over HTTP:

```sh
python3 -m http.server
# open http://localhost:8000
```

## Structure

```
index.html        markup
css/style.css     styles
js/main.js        preloader, intro, cursor, scroll animations
js/background.js  ambient canvas background
```

## License

[PolyForm Noncommercial 1.0.0](LICENSE) - free to use, modify and share for
any **noncommercial** purpose. Commercial use is not permitted.

Bundled libraries keep their own licenses (GSAP, Lenis).
