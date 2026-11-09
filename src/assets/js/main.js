// Mujer Medicina · interacciones
// Todo es progresivo: sin JavaScript el sitio funciona completo, y con
// "reducir movimiento" activado se desactivan parallax, rotaciones y efectos.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Encabezado: borde al desplazarse, se oculta al bajar ---------- */
  const header = $("[data-header]");
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 8);
    const goingDown = y > lastY && y > 320;
    if (!document.body.classList.contains("nav-open")) header?.classList.toggle("is-hidden", goingDown);
    lastY = y;
  };

  /* ---------- Menú móvil ---------- */
  const toggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");
  const setMenu = (open) => {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".visually-hidden").textContent = open ? "Cerrar menú" : "Abrir menú";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    header?.classList.remove("is-hidden");
  };
  toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  window.matchMedia("(min-width: 1080px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Menú desplegable de propuestas ---------- */
  const mega = $("[data-mega]");
  const megaBtn = $("[data-mega-toggle]");
  let megaTimer;
  const setMega = (open) => {
    if (!mega) return;
    mega.classList.toggle("is-open", open);
    megaBtn.setAttribute("aria-expanded", String(open));
  };
  megaBtn?.addEventListener("click", () => setMega(!mega.classList.contains("is-open")));
  if (mega && finePointer) {
    mega.addEventListener("mouseenter", () => { if (innerWidth >= 1080) { clearTimeout(megaTimer); setMega(true); } });
    mega.addEventListener("mouseleave", () => { if (innerWidth >= 1080) megaTimer = setTimeout(() => setMega(false), 220); });
  }
  mega?.addEventListener("focusout", (e) => { if (innerWidth >= 1080 && !mega.contains(e.relatedTarget)) setMega(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (mega?.classList.contains("is-open")) { setMega(false); megaBtn.focus(); }
    else if (nav?.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => { if (mega && innerWidth >= 1080 && !mega.contains(e.target)) setMega(false); });

  /* ---------- Apariciones al hacer scroll ---------- */
  const revealables = $$("[data-reveal], [data-split], [data-draw], .path li");
  if (!("IntersectionObserver" in window) || reduce) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Parallax sutil y progreso de recorridos (un solo rAF) ---------- */
  const parallaxEls = reduce ? [] : $$("[data-parallax]").map((el) => ({ el, k: parseFloat(el.dataset.parallax) || 0 }));
  const path = $("[data-path]");
  const readBar = $("[data-read-progress]");
  const article = $("[data-article]");
  const isSmall = () => innerWidth < 760;
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    if (!isSmall()) {
      for (const { el, k } of parallaxEls) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const center = r.top + r.height / 2 - vh / 2;
        el.style.translate = `0 ${(-center * k).toFixed(1)}px`;
      }
    }
    if (path) {
      const r = path.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height || 1)));
      path.style.setProperty("--path-progress", p.toFixed(3));
    }
    if (readBar && article) {
      const r = article.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh * 0.6)));
      readBar.parentElement.style.setProperty("--read", p.toFixed(3));
      readBar.style.setProperty("--read", p.toFixed(3));
    }
  };
  const onScroll = () => {
    onScrollHeader();
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---------- Roles que se alternan en el inicio ---------- */
  const roles = $("[data-roles]");
  if (roles && !reduce) {
    const items = $$(".roles__item", roles);
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      const prev = items[i];
      i = (i + 1) % items.length;
      prev.classList.remove("is-active");
      prev.classList.add("is-leaving");
      items[i].classList.remove("is-leaving");
      items[i].classList.add("is-active");
      setTimeout(() => prev.classList.remove("is-leaving"), 900);
    }, 2600);
  }

  /* ---------- Luz que sigue al cursor y leve inclinación (solo mouse) ---------- */
  if (finePointer && !reduce) {
    $$("[data-spot]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(700px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-3px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
    // Botones magnéticos: se acercan levemente al cursor
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.15).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Universo de propuestas (inicio) ---------- */
  const universe = $("[data-universe]");
  if (universe) {
    const def = $("[data-u-default]", universe);
    const det = $("[data-u-detail]", universe);
    const nodes = $$("[data-u-node]", universe);
    let hideTimer;
    const show = (a) => {
      clearTimeout(hideTimer);
      nodes.forEach((n) => n.parentElement.classList.toggle("is-active", n === a));
      $("[data-u-kicker]", det).textContent = a.dataset.kicker;
      $("[data-u-title]", det).textContent = a.dataset.title;
      $("[data-u-text]", det).textContent = a.dataset.text;
      $("[data-u-link]", det).href = a.getAttribute("href");
      def.hidden = true; det.hidden = false;
      det.style.animation = "none"; void det.offsetWidth; det.style.animation = "";
    };
    const reset = () => {
      hideTimer = setTimeout(() => {
        nodes.forEach((n) => n.parentElement.classList.remove("is-active"));
        def.hidden = false; det.hidden = true;
      }, 1800);
    };
    nodes.forEach((a) => {
      a.addEventListener("mouseenter", () => show(a));
      a.addEventListener("focus", () => show(a));
      a.addEventListener("mouseleave", reset);
      a.addEventListener("blur", reset);
    });
    det.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    det.addEventListener("mouseleave", reset);

    // Leyenda: resalta las propuestas de una categoría
    $$("[data-legend]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.legend;
        const active = btn.classList.toggle("is-active");
        $$("[data-legend]").forEach((b) => { if (b !== btn) b.classList.remove("is-active"); });
        btn.setAttribute("aria-pressed", String(active));
        universe.classList.toggle("is-filtered", active);
        $$(".u-node", universe).forEach((li) => li.classList.toggle("is-match", active && li.dataset.cat === id));
      });
      btn.setAttribute("aria-pressed", "false");
    });
  }

  /* ---------- Filtro por categoría (propuestas) ---------- */
  const filter = $("[data-filter]");
  if (filter) {
    const blocks = $$("[data-cat-block]");
    const apply = (value, scroll) => {
      $$("[data-filter-value]", filter).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterValue === value)));
      blocks.forEach((bl) => {
        const show = value === "todas" || bl.dataset.catBlock === value;
        bl.hidden = !show;
        if (show) { bl.classList.remove("is-entering"); void bl.offsetWidth; bl.classList.add("is-entering"); }
        $$("[data-reveal]", bl).forEach((el) => el.classList.add("is-visible"));
      });
      if (scroll) filter.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    filter.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter-value]");
      if (!b) return;
      apply(b.dataset.filterValue, false);
      history.replaceState(null, "", b.dataset.filterValue === "todas" ? location.pathname : `#${b.dataset.filterValue}`);
    });
    const initial = location.hash.slice(1);
    if (initial && blocks.some((bl) => bl.dataset.catBlock === initial)) apply(initial, true);
  }

  /* ---------- Formulario de consulta → WhatsApp ---------- */
  $$("[data-consult]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const nombre = form.nombre.value.trim();
      const propuesta = form.propuesta.value;
      const extra = form.text.value.trim();
      let msg = `Hola Lucía, soy ${nombre}.`;
      msg += propuesta ? ` Quisiera información sobre ${propuesta}.` : " Llegué desde tu web y quisiera hacerte una consulta.";
      if (extra) msg += ` ${extra}`;
      window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    });
  });
})();
