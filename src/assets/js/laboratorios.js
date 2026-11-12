// Mujer Medicina · laboratorios de exploración
// Se carga solo en /laboratorios/. Sin dependencias. Todo funciona con toque, mouse y teclado;
// con «reducir movimiento» las escenas muestran su estado final sin animar.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  };
  const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };

  /* ---------- Descargas e impresión de un SVG ---------- */
  const serializar = (svg) => {
    const c = svg.cloneNode(true);
    c.setAttribute("xmlns", NS);
    c.removeAttribute("class");
    $$("[data-no-export]", c).forEach((n) => n.remove());
    // Las animaciones viven en CSS: en el archivo exportado todo queda en su estado final
    $$("*", c).forEach((n) => { n.removeAttribute("class"); n.removeAttribute("tabindex"); n.removeAttribute("role"); n.removeAttribute("aria-label"); });
    return new XMLSerializer().serializeToString(c);
  };
  const bajar = (href, nombre) => {
    const a = document.createElement("a");
    a.href = href; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  };
  const descargarSVG = (svg, nombre) => {
    const url = URL.createObjectURL(new Blob([serializar(svg)], { type: "image/svg+xml" }));
    bajar(url, nombre); setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const descargarPNG = (svg, nombre, lado = 1600, fondo = "#ffffff") => new Promise((ok) => {
    const vb = svg.viewBox.baseVal;
    const alto = Math.round(lado * vb.height / vb.width);
    const url = URL.createObjectURL(new Blob([serializar(svg)], { type: "image/svg+xml" }));
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas"); cv.width = lado; cv.height = alto;
      const ctx = cv.getContext("2d"); ctx.fillStyle = fondo; ctx.fillRect(0, 0, lado, alto);
      ctx.drawImage(img, 0, 0, lado, alto);
      URL.revokeObjectURL(url);
      cv.toBlob((b) => { const u = URL.createObjectURL(b); bajar(u, nombre); setTimeout(() => URL.revokeObjectURL(u), 4000); ok(); }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); descargarSVG(svg, nombre.replace(/\.png$/, ".svg")); ok(); };
    img.src = url;
  });
  const imprimir = (svg, titulo, pie) => {
    const w = window.open("", "_blank");
    if (!w) { window.print(); return; }
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title><style>@page{margin:14mm}body{margin:0;font-family:Georgia,serif;text-align:center;color:#1D313B}svg{width:100%;max-width:170mm;height:auto}h1{font-weight:400;font-size:20pt;margin:0 0 8mm}p{font-size:10pt;color:#4A6A6F}</style></head><body><h1>${titulo}</h1>${serializar(svg)}<p>${pie}</p><script>onload=()=>{print();setTimeout(()=>close(),300)}<\/script></body></html>`);
    w.document.close();
  };

  /* ---------- Índice lateral: marca la sección actual y las ya recorridas ---------- */
  const indice = $("[data-lab-index]");
  if (indice && "IntersectionObserver" in window) {
    const links = $$("a", indice);
    const secs = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
    const marcar = (id) => {
      let pasado = true;
      links.forEach((a) => {
        const actual = a.hash.slice(1) === id;
        if (actual) pasado = false;
        a.classList.toggle("is-actual", actual);
        a.classList.toggle("is-hecho", pasado && !actual);
        if (actual) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current");
      });
      const act = links.find((a) => a.classList.contains("is-actual"));
      if (act && innerWidth < 1000) act.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
    };
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) marcar(vis[0].target.id);
    }, { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach((s) => io.observe(s));
  }

  const init = {
    /* =====================================================
       1 · Los cuatro elementos: identidad, encuentros y círculo completo
       ===================================================== */
    elementos(root) {
      const nodos = $$("[data-el]", root);
      const panel = $("[data-el-panel]", root);
      const inicial = panel.innerHTML;
      const plantillas = Object.fromEntries($$("template[data-el-t]", root).map((t) => [t.dataset.elT, t]));
      const orden = ["fuego", "aire", "tierra", "agua"];
      let sel = [];
      const pintar = () => {
        nodos.forEach((n) => n.setAttribute("aria-pressed", String(sel.includes(n.dataset.el))));
        $$("[data-el-aura]", root).forEach((a) => a.classList.toggle("is-on", sel.includes(a.dataset.elAura)));
        const clave = sel.length === 2 ? [...sel].sort().join("+") : null;
        $$(".el-link", root).forEach((l) => {
          const [a, b] = l.dataset.par.split("+");
          const on = sel.length === 4 ? true : clave === l.dataset.par || (sel.length === 3 && sel.includes(a) && sel.includes(b));
          l.classList.toggle("is-on", on && (sel.length !== 4 || !l.classList.contains("el-link--flujo") || orden.indexOf(a) + orden.indexOf(b) !== 3));
        });
        let t = null;
        if (sel.length === 1) t = plantillas[sel[0]];
        else if (sel.length === 2) t = plantillas[clave];
        else if (sel.length === 3) t = plantillas.tres;
        else if (sel.length === 4) t = plantillas.todos;
        const glifo = t?.dataset.glifo || null;
        $$("[data-glifo]", root).forEach((g) => g.classList.toggle("is-on", g.dataset.glifo === glifo));
        panel.innerHTML = t ? t.innerHTML : inicial;
        const acc = sel.length === 1 ? nodos.find((n) => n.dataset.el === sel[0]).className.match(/accent-[\w-]+/)?.[0] : null;
        const card = $(".el-lab__card", panel);
        if (card && acc) card.classList.add(acc);
      };
      nodos.forEach((n) => n.addEventListener("click", () => {
        const id = n.dataset.el;
        sel = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
        pintar();
      }));
      $("[data-el-reset]", root)?.addEventListener("click", () => { sel = []; pintar(); nodos[0].focus(); });
    },

    /* Cuestionario: cada respuesta muestra de qué texto sale */
    quiz(root) {
      const preguntas = JSON.parse($("template[data-quiz]", root).innerHTML);
      const q = $("[data-quiz-q]", root), prog = $("[data-quiz-prog]", root), fb = $("[data-quiz-fb]", root);
      const ops = $$("[data-quiz-op]", root), sig = $("[data-quiz-next]", root), reset = $("[data-quiz-reset]", root);
      const nombres = Object.fromEntries(ops.map((o) => [o.dataset.quizOp, o.textContent.trim()]));
      let i = 0, aciertos = 0;
      const mostrar = () => {
        const p = preguntas[i];
        prog.textContent = `Pregunta ${i + 1} de ${preguntas.length}`;
        q.textContent = p.q; fb.textContent = "";
        ops.forEach((o) => { o.disabled = false; o.hidden = false; o.classList.remove("is-ok", "is-mal"); });
        sig.hidden = true; reset.hidden = true;
      };
      ops.forEach((o) => o.addEventListener("click", () => {
        const p = preguntas[i];
        const bien = o.dataset.quizOp === p.a;
        if (bien) aciertos++;
        ops.forEach((x) => { x.disabled = true; if (x.dataset.quizOp === p.a) x.classList.add("is-ok"); });
        if (!bien) o.classList.add("is-mal");
        fb.innerHTML = `<strong>${bien ? "¡Así es!" : `Es ${nombres[p.a].toLowerCase()}.`}</strong> ${p.ok} <a href="${p.url}">${p.fuente}</a>`;
        const ultima = i === preguntas.length - 1;
        sig.textContent = ultima ? "Ver resultado" : "Siguiente";
        sig.hidden = false; sig.focus();
      }));
      sig.addEventListener("click", () => {
        if (i < preguntas.length - 1) { i++; mostrar(); ops[0].focus(); return; }
        prog.textContent = "Resultado";
        q.textContent = aciertos === preguntas.length ? "Cinco de cinco" : `${aciertos} de ${preguntas.length}`;
        fb.textContent = aciertos === preguntas.length ? "Recorriste los cuatro elementos." : "Podés volver a intentarlo, o releer los textos enlazados.";
        ops.forEach((o) => { o.hidden = true; });
        sig.hidden = true; reset.hidden = false; reset.focus();
      });
      reset.addEventListener("click", () => { i = 0; aciertos = 0; mostrar(); ops[0].focus(); });
    },

    /* =====================================================
       2 · Altar: colocar, mover, girar, guardar, descargar, imprimir
       ===================================================== */
    altar(root) {
      const svg = $("[data-altar-svg]", root);
      const capa = $("[data-altar-objetos]", root);
      const msg = $("[data-altar-msg]", root);
      const vacio = $("[data-altar-vacio]", root);
      const lazo = $("[data-altar-lazo]", root);
      const selBox = $("[data-altar-sel]", root);
      const selNombre = $("[data-altar-sel-nombre]", root);
      const botones = $$("[data-agregar]", root);
      const nombres = Object.fromEntries(botones.map((b) => [b.dataset.agregar, b.dataset.nombre]));
      const elDe = Object.fromEntries(botones.filter((b) => b.dataset.el).map((b) => [b.dataset.agregar, b.dataset.el]));
      const CLAVE = "mm-altar-v1";
      const telas = { clara: "#FBF8F2", agua: "#F1FAFA", tejida: "#F4FAEF", noche: "#24464C" };
      let estado = { tela: "clara", items: [] };
      let seleccionado = null, uid = 0;

      const punto = (e) => {
        const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        return p.matrixTransform(svg.getScreenCTM().inverse());
      };
      const limitar = (it) => {
        const dx = it.x - 200, dy = it.y - 200, d = Math.hypot(dx, dy), max = 160;
        if (d > max) { it.x = 200 + dx / d * max; it.y = 200 + dy / d * max; }
      };
      const nodoDe = (it) => $(`[data-uid="${it.uid}"]`, capa);
      const transformar = (it) => nodoDe(it)?.setAttribute("transform", `translate(${it.x.toFixed(1)} ${it.y.toFixed(1)}) rotate(${it.r}) scale(${it.s})`);

      const actualizar = () => {
        vacio.hidden = estado.items.length > 0;
        botones.forEach((b) => b.classList.toggle("is-puesto", estado.items.some((it) => it.t === b.dataset.agregar)));
        // Si están los cuatro elementos, un lazo los une y el altar se activa
        const els = ["fuego", "aire", "tierra", "agua"].map((e) => estado.items.find((it) => elDe[it.t] === e));
        const activo = els.every(Boolean);
        root.classList.toggle("is-activo", activo);
        lazo.setAttribute("points", activo ? els.map((it) => `${it.x.toFixed(1)},${it.y.toFixed(1)}`).join(" ") : "");
        guardar(CLAVE, estado);
        return activo;
      };
      const seleccionar = (it) => {
        seleccionado = it;
        $$(".altar-obj", capa).forEach((n) => n.classList.toggle("is-sel", it && n.dataset.uid === String(it.uid)));
        selBox.hidden = !it;
        if (it) selNombre.textContent = nombres[it.t];
      };
      const crearNodo = (it) => {
        const g = svgEl("g", { class: "altar-obj", "data-uid": it.uid, tabindex: "0", role: "button", "aria-label": `${nombres[it.t]}. Arrastrá o usá las flechas para moverlo; Suprimir para quitarlo` });
        const dib = svgEl("g", { class: "altar-obj__dib" });
        dib.appendChild(svgEl("circle", { class: "altar-obj__sel", r: "34", "data-no-export": "" }));
        dib.appendChild(svgEl("use", { href: `#ob-${it.t}`, x: "-30", y: "-30", width: "60", height: "60" }));
        g.appendChild(dib);
        capa.appendChild(g);
        transformar(it);
        // Arrastrar con mouse o dedo
        g.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          g.setPointerCapture(e.pointerId);
          seleccionar(it);
          const p0 = punto(e), x0 = it.x, y0 = it.y;
          capa.appendChild(g); // al frente
          const mover = (ev) => { const p = punto(ev); it.x = x0 + p.x - p0.x; it.y = y0 + p.y - p0.y; limitar(it); transformar(it); };
          const soltar = () => { g.removeEventListener("pointermove", mover); g.removeEventListener("pointerup", soltar); g.removeEventListener("pointercancel", soltar); actualizar(); };
          g.addEventListener("pointermove", mover); g.addEventListener("pointerup", soltar); g.addEventListener("pointercancel", soltar);
        });
        g.addEventListener("focus", () => seleccionar(it));
        g.addEventListener("keydown", (e) => {
          const paso = e.shiftKey ? 24 : 8;
          const mov = { ArrowLeft: [-paso, 0], ArrowRight: [paso, 0], ArrowUp: [0, -paso], ArrowDown: [0, paso] }[e.key];
          if (mov) { e.preventDefault(); it.x += mov[0]; it.y += mov[1]; limitar(it); transformar(it); actualizar(); }
          else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); quitar(it); }
          else if (e.key === "r" || e.key === "R") { it.r = (it.r + 30) % 360; transformar(it); actualizar(); }
        });
      };
      const agregar = (t, silencio) => {
        // Se ubica en espiral alrededor del centro para no superponerse
        const n = estado.items.length, ang = n * 2.4, rad = 60 + (n % 6) * 16;
        const it = { uid: ++uid, t, x: 200 + Math.cos(ang) * rad, y: 200 + Math.sin(ang) * rad, r: 0, s: 1 };
        limitar(it);
        estado.items.push(it);
        crearNodo(it);
        const activo = actualizar();
        if (!silencio) {
          msg.textContent = activo ? "Tu altar está activo" : `${nombres[t]} en tu altar`;
          seleccionar(it);
        }
        return it;
      };
      const quitar = (it) => {
        estado.items = estado.items.filter((x) => x !== it);
        nodoDe(it)?.remove();
        seleccionar(null);
        msg.textContent = `${nombres[it.t]}: fuera del altar`;
        actualizar();
      };
      const ponerTela = (id) => {
        estado.tela = id;
        root.dataset.tela = id;
        $("[data-tela-fondo]", root).setAttribute("fill", telas[id] || telas.clara);
        $$("[data-tela-patron]", root).forEach((p) => p.setAttribute("opacity", p.dataset.telaPatron === id ? "1" : "0"));
        $("[data-tela-borde]", root).setAttribute("stroke", id === "noche" ? "#5FB0B3" : "#E7DCC6");
        $$("[data-tela]", root).forEach((b) => b.getAttribute("aria-pressed") !== null && b.setAttribute("aria-pressed", String(b.dataset.tela === id)));
      };

      botones.forEach((b) => b.addEventListener("click", () => {
        const it = agregar(b.dataset.agregar);
        // En teclado, el foco pasa al objeto recién puesto para poder moverlo enseguida
        if (b.matches(":focus-visible")) nodoDe(it)?.focus();
      }));
      $$(".altar-lab__tela-btn", root).forEach((b) => b.addEventListener("click", () => { ponerTela(b.dataset.tela); actualizar(); msg.textContent = `Tela ${b.textContent.trim().toLowerCase()}`; }));
      $$("[data-accion]", root).forEach((b) => b.addEventListener("click", () => {
        const it = seleccionado; if (!it) return;
        const a = b.dataset.accion;
        if (a === "quitar") return quitar(it);
        if (a === "girar") it.r = (it.r + 30) % 360;
        if (a === "mas") it.s = Math.min(1.8, +(it.s + 0.15).toFixed(2));
        if (a === "menos") it.s = Math.max(0.55, +(it.s - 0.15).toFixed(2));
        transformar(it); actualizar();
      }));
      svg.addEventListener("pointerdown", (e) => { if (!e.target.closest(".altar-obj")) seleccionar(null); });
      $("[data-altar-limpiar]", root).addEventListener("click", () => {
        estado.items = []; capa.replaceChildren(); seleccionar(null); actualizar(); msg.textContent = "Elegí qué poner";
      });
      $("[data-altar-descargar]", root).addEventListener("click", () => { seleccionar(null); descargarPNG(svg, "mi-altar.png", 1400, "#ffffff"); });
      $("[data-altar-imprimir]", root).addEventListener("click", () => { seleccionar(null); imprimir(svg, "Mi altar", "La ubicación de los elementos será como tú lo sientas."); });

      // Recupera el altar guardado en este navegador
      const prev = leer(CLAVE);
      ponerTela(prev?.tela && telas[prev.tela] ? prev.tela : "clara");
      if (prev?.items?.length) {
        prev.items.filter((it) => nombres[it.t]).forEach((p) => {
          const it = agregar(p.t, true); Object.assign(it, { x: p.x, y: p.y, r: p.r || 0, s: p.s || 1 }); limitar(it); transformar(it);
        });
        msg.textContent = actualizar() ? "Tu altar está activo" : "Tu altar, como lo dejaste";
      }
      actualizar();
    },

    /* =====================================================
       3 · Generador de mandalas
       ===================================================== */
    mandala(root) {
      const svg = $("[data-mandala-svg]", root);
      const capas = $("[data-mandala-capas]", root);
      const fondo = $("[data-mandala-fondo]", root);
      const form = $("[data-mandala-form]", root);
      const msg = $("[data-mandala-msg]", root);
      const paletas = Object.fromEntries(JSON.parse($("template[data-paletas]", root).innerHTML).map((p) => [p.id, p]));
      const formas = ["petalo", "gota", "hoja", "rombo", "arco", "punto"];
      // Formas base, apuntando hacia arriba, entre r0 (interior) y r1 (exterior), con ancho w
      const forma = (tipo, r0, r1, w) => {
        const m = (r0 + r1) / 2, h = r1 - r0;
        switch (tipo) {
          case "gota": return `M0 ${-r0}C${w} ${-r0 - h * .35} ${w * .6} ${-r1 + h * .2} 0 ${-r1}C${-w * .6} ${-r1 + h * .2} ${-w} ${-r0 - h * .35} 0 ${-r0}Z`;
          case "hoja": return `M0 ${-r0}Q${w} ${-m} 0 ${-r1}Q${-w} ${-m} 0 ${-r0}Z`;
          case "rombo": return `M0 ${-r0}L${w * .8} ${-m}L0 ${-r1}L${-w * .8} ${-m}Z`;
          case "arco": return `M${-w} ${-r0}A${w} ${h} 0 0 1 ${w} ${-r0}`;
          case "punto": return null;
          default: return `M0 ${-r0}C${w * 1.1} ${-r0 - h * .2} ${w * 1.1} ${-r1 + h * .25} 0 ${-r1}C${-w * 1.1} ${-r1 + h * .25} ${-w * 1.1} ${-r0 - h * .2} 0 ${-r0}Z`;
        }
      };
      const leerForm = () => {
        const f = new FormData(form);
        return { puntas: +f.get("puntas"), vueltas: +f.get("vueltas"), grosor: +f.get("grosor"), forma: f.get("forma"), paleta: f.get("paleta"), colorear: f.get("colorear") === "on", fibo: f.get("fibo") === "on", girasol: f.get("girasol") === "on" };
      };
      const ponerForm = (c) => {
        form.puntas.value = c.puntas; form.vueltas.value = c.vueltas; form.grosor.value = c.grosor;
        $$(`input[name="forma"]`, form).forEach((i) => { i.checked = i.value === c.forma; });
        $$(`input[name="paleta"]`, form).forEach((i) => { i.checked = i.value === c.paleta; });
        form.colorear.checked = !!c.colorear;
        form.fibo.checked = !!c.fibo; form.girasol.checked = !!c.girasol;
      };
      const dibujar = (c) => {
        $$("[data-out]", form).forEach((o) => { o.textContent = c[o.dataset.out]; });
        const pal = paletas[c.paleta] || paletas.mandala;
        const tinta = c.colorear ? "#1D313B" : null;
        fondo.setAttribute("fill", c.colorear ? "#ffffff" : pal.fondo || "#ffffff");
        capas.replaceChildren();
        const R = 280;
        // Modo Fibonacci: cada vuelta es φ veces más ancha que la anterior y las puntas siguen 5, 8, 13, 21…
        const PHI = (1 + Math.sqrt(5)) / 2;
        const FIB = [3, 5, 8, 13, 21, 34, 55, 89, 144];
        const centro = c.girasol ? (c.fibo ? 34 : 34) : 22;
        const pesos = Array.from({ length: c.vueltas }, (_, v) => (c.fibo ? Math.pow(PHI, v) : 1));
        const total = pesos.reduce((a, b) => a + b, 0);
        const bordes = [centro]; pesos.forEach((p) => bordes.push(bordes[bordes.length - 1] + (R - centro) * p / total));
        const iFib = Math.max(0, FIB.findIndex((x) => x >= Math.min(c.puntas, 13)));
        const nodo = (v, n, d, color, relleno, extra = {}) => {
          const g = svgEl("g", { class: "m-capa", style: `--v:${v}` });
          for (let k = 0; k < n; k++) {
            const ang = (360 / n) * k + (extra.desfase || 0);
            const el = d ? svgEl("path", { d, transform: `rotate(${ang.toFixed(2)})` }) : svgEl("circle", { cx: 0, cy: -extra.r, r: extra.rp, transform: `rotate(${ang.toFixed(2)})` });
            if (relleno && !c.colorear) {
              const f = el.cloneNode(); f.setAttribute("fill", relleno); f.setAttribute("stroke", "none"); f.setAttribute("class", "m-relleno"); f.setAttribute("style", `--op:${extra.op || .85}`);
              g.appendChild(f);
            }
            el.setAttribute("fill", "none"); el.setAttribute("stroke", tinta || color); el.setAttribute("stroke-width", c.grosor);
            el.setAttribute("stroke-linecap", "round"); el.setAttribute("stroke-linejoin", "round");
            el.setAttribute("pathLength", "1"); el.setAttribute("class", "m-trazo");
            g.appendChild(el);
          }
          capas.appendChild(g);
        };
        for (let v = 0; v < c.vueltas; v++) {
          const r0 = bordes[v], paso = bordes[v + 1] - bordes[v], r1 = r0 + paso * .95;
          // Cada vuelta alterna la forma elegida con formas vecinas, para que la mandala respire
          const tipo = v % 2 === 0 ? c.forma : formas[(formas.indexOf(c.forma) + v) % formas.length];
          const n = c.fibo ? FIB[Math.min(FIB.length - 1, iFib + v)] : v === 0 ? c.puntas : c.puntas * (v % 3 === 2 ? 2 : 1);
          const w = Math.min(paso * .8, (Math.PI * (r0 + paso / 2) / n) * 0.95);
          const color = pal.colores[v % pal.colores.length];
          const relleno = pal.colores[(v + 2) % pal.colores.length];
          const desfase = v % 2 ? 180 / n : 0;
          const d = forma(tipo, r0, r1, w);
          if (d) nodo(v, n, d, color, tipo === "arco" ? null : relleno, { desfase, op: .55 });
          else nodo(v, n, null, color, relleno, { desfase, r: (r0 + r1) / 2, rp: Math.max(3, Math.min(w * .7, paso * .35)), op: .9 });
          // Anillo fino que separa las vueltas
          const anillo = svgEl("circle", { r: r1.toFixed(1), fill: "none", stroke: tinta || pal.colores[(v + 1) % pal.colores.length], "stroke-width": Math.max(.6, c.grosor * .45), "stroke-dasharray": v % 2 ? "2 6" : "none", pathLength: v % 2 ? null : "1", class: v % 2 ? "" : "m-trazo", style: `--v:${v}`, opacity: ".7" });
          if (v % 2) anillo.removeAttribute("pathLength");
          capas.appendChild(anillo);
        }
        if (c.girasol) {
          // Centro de girasol: 89 semillas repartidas con el ángulo áureo (137,5°)
          const sem = svgEl("g", { class: "m-capa m-relleno", style: "--v:0;--op:1" });
          const ga = Math.PI * 2 / (PHI * PHI), k = (centro - 3) / Math.sqrt(89);
          for (let i = 0; i < 89; i++) {
            const r = k * Math.sqrt(i + .5), th = i * ga;
            sem.appendChild(svgEl("circle", { cx: (r * Math.cos(th)).toFixed(2), cy: (r * Math.sin(th)).toFixed(2), r: (1 + i / 89 * 1.6).toFixed(2), fill: c.colorear ? "none" : pal.colores[i % 2 ? 0 : 1], stroke: c.colorear ? tinta : "none", "stroke-width": c.colorear ? .6 : 0 }));
          }
          capas.appendChild(sem);
        } else {
          capas.appendChild(svgEl("circle", { r: centro * .7, fill: c.colorear ? "#fff" : "#FCF6DF", stroke: tinta || "#E7C65A", "stroke-width": c.grosor }));
        }
        msg.textContent = c.fibo ? `Fibonacci · ${c.vueltas} vueltas` : `${c.puntas} puntas · ${c.vueltas} vueltas`;
        // Enlace directo a esta mandala
        const q = new URLSearchParams({ p: c.puntas, v: c.vueltas, g: c.grosor, f: c.forma, c: c.paleta, ...(c.colorear ? { l: 1 } : {}), ...(c.fibo ? { fi: 1 } : {}), ...(c.girasol ? { gi: 1 } : {}) });
        history.replaceState(null, "", `#${q}`);
      };
      let timer;
      const redibujar = () => { clearTimeout(timer); timer = setTimeout(() => dibujar(leerForm()), 60); };
      form.addEventListener("input", redibujar);
      form.addEventListener("submit", (e) => e.preventDefault());
      $("[data-mandala-azar]", root).addEventListener("click", () => {
        const r = (a) => a[Math.floor(Math.random() * a.length)];
        ponerForm({ puntas: r([6, 8, 9, 10, 12, 16]), vueltas: 3 + Math.floor(Math.random() * 5), grosor: r([1.5, 2, 2.5, 3]), forma: r(formas.filter((f) => f !== "punto")), paleta: r(Object.keys(paletas)), colorear: false, fibo: Math.random() < .382, girasol: Math.random() < .382 });
        dibujar(leerForm());
      });
      $("[data-mandala-tejer]", root).addEventListener("click", () => dibujar(leerForm()));
      $("[data-mandala-png]", root).addEventListener("click", () => descargarPNG(svg, "mi-mandala.png", 1600, leerForm().colorear ? "#ffffff" : (paletas[leerForm().paleta]?.fondo || "#ffffff")));
      $("[data-mandala-svgdl]", root).addEventListener("click", () => descargarSVG(svg, "mi-mandala.svg"));
      $("[data-mandala-imprimir]", root).addEventListener("click", () => imprimir(svg, "Mi mandala", "Mandala es una palabra sánscrita que significa «círculo»."));
      const linkBtn = $("[data-mandala-link]", root), linkT = $("[data-mandala-link-t]", root);
      linkBtn.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(location.href); linkT.textContent = "¡Enlace copiado!"; }
        catch { linkT.textContent = location.href; }
        setTimeout(() => { linkT.textContent = "Copiar enlace a esta mandala"; }, 2500);
      });
      // Si la dirección trae una mandala, se reconstruye
      const h = new URLSearchParams(location.hash.slice(1));
      if (h.get("p")) {
        ponerForm({ puntas: Math.min(24, Math.max(4, +h.get("p") || 8)), vueltas: Math.min(8, Math.max(2, +h.get("v") || 5)), grosor: Math.min(5, Math.max(1, +h.get("g") || 2)), forma: formas.includes(h.get("f")) ? h.get("f") : "petalo", paleta: paletas[h.get("c")] ? h.get("c") : "mandala", colorear: h.get("l") === "1", fibo: h.get("fi") === "1", girasol: h.get("gi") === "1" });
      }
      dibujar(leerForm());
      if (!reduce) svg.classList.add("is-girando");
    },

    /* =====================================================
       4 · Recorrido con scroll: la escena sigue al texto
       ===================================================== */
    scrolly(root) {
      const stage = $("[data-scrolly-stage]", root);
      const cap = $("[data-scrolly-caption]", root);
      const pasos = $$("[data-scrolly-paso]", root);
      const dots = $$("[data-scrolly-dot]", root);
      const ir = (i) => {
        const p = pasos[i];
        stage.dataset.paso = p.dataset.scrollyPaso;
        cap.textContent = p.dataset.escena;
        pasos.forEach((x, k) => x.classList.toggle("is-actual", k === i));
        dots.forEach((d, k) => d.classList.toggle("is-on", k <= i));
      };
      // El paso activo es el más cercano al centro de la pantalla (robusto aunque se desplace rápido)
      let actual = -1, tick = false;
      const elegir = () => {
        tick = false;
        const centro = innerHeight / 2;
        let mejor = 0, dist = Infinity;
        pasos.forEach((p, i) => { const r = p.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - centro); if (d < dist) { dist = d; mejor = i; } });
        if (mejor !== actual) { actual = mejor; ir(mejor); }
      };
      addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(elegir); } }, { passive: true });
      addEventListener("resize", elegir, { passive: true });
      elegir();
    },

    /* =====================================================
       5 · Calendario del ciclo y carpeta de recursos
       ===================================================== */
    calendario(root) {
      const botones = $$("[data-frec]", root);
      const cuando = $$("[data-cal-cuando]", root);
      const total = $("[data-cal-total]", root);
      const linea = $("[data-cal-linea]", root);
      const poner = (dias) => {
        botones.forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.frec === dias)));
        cuando.forEach((c, i) => {
          c.textContent = i === 0 ? "Inicio" : dias === 15 ? `Semana ${i * 2 + 1}` : `Mes ${i + 1}`;
        });
        total.textContent = dias === 15 ? "Unas 6 semanas" : "Unos 3 meses";
        linea.style.setProperty("--escala", dias === 15 ? ".5" : "1");
        root.classList.remove("is-cambio"); void root.offsetWidth; root.classList.add("is-cambio");
        setTimeout(() => root.classList.remove("is-cambio"), 400);
      };
      botones.forEach((b) => b.addEventListener("click", () => poner(+b.dataset.frec)));
      linea.style.setProperty("--escala", ".5");
    },
    carpeta(root) {
      const items = $$("[data-carpeta-item]", root);
      const estado = $("[data-carpeta-estado]", root);
      items.forEach((b) => b.addEventListener("click", () => {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        const n = items.filter((x) => x.getAttribute("aria-pressed") === "true").length;
        estado.textContent = n === 0 ? "Tu carpeta está vacía" : n === items.length ? "Todo lo que te queda" : `${n} de ${items.length} en tu carpeta`;
      }));
    },

    /* =====================================================
       6 · Cielo: encender las siete hermanas
       ===================================================== */
    cielo(root) {
      const estrellas = $$("[data-estrella]", root);
      const lineas = $$("[data-une]", root);
      const estado = $("[data-cielo-estado]", root);
      const reset = $("[data-cielo-reset]", root);
      const hermanas = estrellas.filter((e) => !e.classList.contains("cielo__estrella--padre"));
      const pintar = (ultima) => {
        const on = new Set(estrellas.filter((e) => e.getAttribute("aria-pressed") === "true").map((e) => e.dataset.estrella));
        lineas.forEach((l) => { const [a, b] = l.dataset.une.split("-"); l.classList.toggle("is-on", on.has(a) && on.has(b)); });
        $$("[data-halo]", root).forEach((h) => h.classList.toggle("is-on", on.has(h.dataset.halo)));
        const n = hermanas.filter((e) => on.has(e.dataset.estrella)).length;
        const completa = n === hermanas.length;
        root.classList.toggle("is-completo", completa);
        estado.textContent = completa ? "Las Siete Hermanas" : ultima ? ultima : n === 0 ? "Siete hermanas dormidas" : `${n} de 7 encendidas`;
        reset.hidden = on.size === 0;
      };
      estrellas.forEach((e) => e.addEventListener("click", () => {
        const on = e.getAttribute("aria-pressed") !== "true";
        e.setAttribute("aria-pressed", String(on));
        pintar(on ? e.dataset.nombre : null);
      }));
      reset.addEventListener("click", () => { estrellas.forEach((e) => e.setAttribute("aria-pressed", "false")); pintar(); estrellas[0].focus(); });
    },

    /* =====================================================
       7 · Proporción áurea
       ===================================================== */
    /* Rectángulos de Fibonacci: cada cuadrado se apoya en el rectángulo anterior,
       girando a la derecha, abajo, izquierda y arriba. La espiral une sus esquinas. */
    fibo(root) {
      const svg = $("[data-fibo-svg]", root), g = $("[data-fibo-g]", root);
      const serie = $("[data-fibo-serie]", root), coc = $("[data-fibo-cociente]", root), dif = $("[data-fibo-dif]", root);
      const btnEsp = $("[data-fibo-espiral]", root);
      const PHI = (1 + Math.sqrt(5)) / 2;
      const colores = ["#F2A29B", "#F3DC8E", "#AFD49A", "#9CCBEB", "#85CFD1", "#7FCBA9", "#A6CE98", "#BAE4E3", "#E8C9A9", "#F2B8A0", "#85CFD1", "#AFD49A"];
      const fmt = (n, d = 6) => n.toLocaleString("es-AR", { maximumFractionDigits: d });
      let n = 2, conEspiral = true, vb = [0, 0, 2, 1], anim;
      // Geometría de los n primeros cuadrados
      const geometria = (n) => {
        const sq = []; let a = 1, b = 1, box = { x: 0, y: 0, w: 1, h: 1 };
        sq.push({ x: 0, y: 0, s: 1, d: 3 });
        for (let k = 1; k < n; k++) {
          const s = k === 1 ? 1 : a + b; if (k > 1) { a = b; b = s; }
          const d = (k - 1) % 4; let x, y;
          if (d === 0) { x = box.x + box.w; y = box.y; }
          else if (d === 1) { x = box.x; y = box.y + box.h; }
          else if (d === 2) { x = box.x - s; y = box.y; }
          else { x = box.x; y = box.y - s; }
          sq.push({ x, y, s, d });
          const x0 = Math.min(box.x, x), y0 = Math.min(box.y, y);
          box = { x: x0, y: y0, w: Math.max(box.x + box.w, x + s) - x0, h: Math.max(box.y + box.h, y + s) - y0 };
        }
        return { sq, box };
      };
      // Cuarto de arco de cada cuadrado según hacia dónde creció
      const arco = ({ x, y, s, d }) => {
        const [x0, y0, x1, y1] = [[x, y, x + s, y + s], [x + s, y, x, y + s], [x + s, y + s, x, y], [x, y + s, x + s, y]][d];
        return `M${x0} ${y0}A${s} ${s} 0 0 1 ${x1} ${y1}`;
      };
      const aplicarVB = (dest) => {
        cancelAnimationFrame(anim);
        const ini = [...vb], t0 = performance.now(), dur = reduce ? 0 : 890;
        const paso = (t) => {
          const k = dur ? Math.min(1, Math.max(0, (t - t0) / dur)) : 1, e = 1 - Math.pow(1 - k, 3);
          vb = ini.map((v, i) => v + (dest[i] - v) * e);
          svg.setAttribute("viewBox", vb.map((v) => v.toFixed(3)).join(" "));
          if (k < 1) anim = requestAnimationFrame(paso);
        };
        anim = requestAnimationFrame(paso);
      };
      const pintar = () => {
        const { sq, box } = geometria(n);
        g.replaceChildren();
        const sw = Math.max(box.w, box.h) / 220;
        sq.forEach((q, i) => {
          const r = svgEl("rect", { x: q.x, y: q.y, width: q.s, height: q.s, fill: colores[i % colores.length], "fill-opacity": ".55", stroke: "#284C53", "stroke-width": sw, class: i === n - 1 ? "fibo__nuevo" : "" });
          g.appendChild(r);
          if (q.s >= Math.max(box.w, box.h) / 14) {
            const t = svgEl("text", { x: q.x + q.s / 2, y: q.y + q.s / 2, "font-size": q.s * .32, "text-anchor": "middle", "dominant-baseline": "central", fill: "#1D313B", "font-family": "Fraunces, Georgia, serif" });
            t.textContent = q.s; g.appendChild(t);
          }
        });
        if (conEspiral) {
          const d = sq.map(arco).join(" ");
          g.appendChild(svgEl("path", { d, fill: "none", stroke: "#2B6F72", "stroke-width": sw * 2.6, "stroke-linecap": "round", class: "fibo__espiral", pathLength: "1" }));
        }
        const pad = Math.max(box.w, box.h) * .04;
        aplicarVB([box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2]);
        const nums = sq.map((q) => q.s);
        serie.textContent = nums.join(", ");
        const c = nums.length > 1 ? nums[nums.length - 1] / nums[nums.length - 2] : 1;
        coc.textContent = `${nums[nums.length - 1]} ÷ ${nums[nums.length - 2]} = ${fmt(c)}`;
        dif.textContent = fmt(Math.abs(c - PHI), 7);
        $("[data-fibo-menos]", root).disabled = n <= 2;
        $("[data-fibo-mas]", root).disabled = n >= 13;
      };
      $("[data-fibo-mas]", root).addEventListener("click", () => { n = Math.min(13, n + 1); pintar(); });
      $("[data-fibo-menos]", root).addEventListener("click", () => { n = Math.max(2, n - 1); pintar(); });
      btnEsp.addEventListener("click", () => { conEspiral = !conEspiral; btnEsp.setAttribute("aria-pressed", String(conEspiral)); btnEsp.textContent = conEspiral ? "Espiral: sí" : "Espiral: no"; pintar(); });
      n = 6; pintar();
    },

    /* Comparador: a cada rectángulo se le quita el mayor cuadrado posible, varias veces */
    ratios(root) {
      const svg = $("[data-ratio-svg]", root), t = $("[data-ratio-t]", root), nota = $("[data-ratio-nota]", root);
      const botones = $$("[data-ratio]", root);
      const colores = ["#BAE4E3", "#AFD49A", "#F3DC8E", "#9CCBEB", "#F2A29B", "#7FCBA9"];
      const pintar = (ratio) => {
        svg.replaceChildren();
        const H = 96, W = H * ratio, x0 = (178 - W) / 2, y0 = 7;
        svg.appendChild(svgEl("rect", { x: x0, y: y0, width: W, height: H, fill: "#fff", stroke: "#284C53", "stroke-width": 1.2 }));
        let x = x0, y = y0, w = W, h = H;
        for (let k = 0; k < 7 && Math.abs(w - h) > 0.4; k++) {
          const s = Math.min(w, h);
          const r = svgEl("rect", { x, y, width: s, height: s, fill: colores[k % colores.length], "fill-opacity": ".75", stroke: "#284C53", "stroke-width": .6, class: "ratios__sq", style: `--k:${k}` });
          svg.appendChild(r);
          if (w > h) { x += s; w -= s; } else { y += s; h -= s; }
        }
        // El resto que queda después del primer corte
        const s0 = Math.min(W, H);
        if (Math.abs(W - H) > 0.4) {
          const rw = W > H ? W - s0 : W, rh = W > H ? H : H - s0;
          svg.appendChild(svgEl("rect", { x: W > H ? x0 + s0 : x0, y: W > H ? y0 : y0 + s0, width: rw, height: rh, fill: "none", stroke: "#E7C65A", "stroke-width": 2, "stroke-dasharray": "3 3", class: "ratios__resto" }));
        }
        t.textContent = `1 : ${ratio.toLocaleString("es-AR", { maximumFractionDigits: 3 })}`;
      };
      botones.forEach((b) => b.addEventListener("click", () => {
        botones.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        nota.textContent = b.dataset.nota; pintar(+b.dataset.ratio);
      }));
      pintar(1.61803);
    },

    /* Filotaxis: semillas que giran un ángulo fijo y se alejan según la raíz cuadrada */
    girasol(root) {
      const g = $("[data-girasol-g]", root), form = $("[data-girasol-form]", root), estado = $("[data-g-estado]", root);
      const colores = ["#3B7A5C", "#7FCBA9", "#A6CE98", "#F3DC8E", "#E7C65A"];
      let crecer = null;
      const dibujar = (ang, n) => {
        $$("[data-g-out]", form).forEach((o) => { o.textContent = o.dataset.gOut === "angulo" ? `${ang.toLocaleString("es-AR")}°` : n; });
        const c = 94 / Math.sqrt(n), rad = Math.max(1.1, c * .48), a = ang * Math.PI / 180;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < n; i++) {
          const r = c * Math.sqrt(i + .5), th = i * a;
          frag.appendChild(svgEl("circle", { cx: (r * Math.cos(th)).toFixed(2), cy: (r * Math.sin(th)).toFixed(2), r: rad.toFixed(2), fill: colores[Math.floor((i / n) * colores.length)] }));
        }
        g.replaceChildren(frag);
        const dAureo = Math.abs(ang - 137.508);
        estado.textContent = dAureo < 0.06 ? "Ángulo áureo" : dAureo < 0.6 ? "Casi parejo" : "Aparecen rayos y huecos";
      };
      const leer = () => [+form.angulo.value, +form.semillas.value];
      form.addEventListener("input", () => { cancelAnimationFrame(crecer); dibujar(...leer()); });
      form.addEventListener("submit", (e) => e.preventDefault());
      $("[data-g-aureo]", root).addEventListener("click", () => { form.angulo.value = 137.5; dibujar(137.508, +form.semillas.value); });
      $("[data-g-crecer]", root).addEventListener("click", () => {
        cancelAnimationFrame(crecer);
        const [ang, n] = leer(); const t0 = performance.now(), dur = reduce ? 0 : 2330;
        const paso = (t) => { const k = dur ? Math.min(1, Math.max(0, (t - t0) / dur)) : 1; dibujar(ang, Math.max(1, Math.round(n * k * k))); if (k < 1) crecer = requestAnimationFrame(paso); };
        crecer = requestAnimationFrame(paso);
      });
      dibujar(137.508, 377);
    },
  };


  $$("[data-lab]").forEach((root) => { try { init[root.dataset.lab]?.(root); } catch (err) { console.error(err); } });

  /* ---------- Índice: filtro del catálogo de experiencias ---------- */
  const filtro = $("[data-exp-filter]");
  if (filtro) {
    const items = $$("[data-exp-lista] li");
    const vacio = $("[data-exp-vacio]");
    filtro.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filtro]"); if (!b) return;
      $$("[data-filtro]", filtro).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let n = 0;
      items.forEach((li) => { const ok = b.dataset.filtro === "todas" || li.dataset.tipo === b.dataset.filtro; li.hidden = !ok; if (ok) n++; });
      vacio.hidden = n > 0;
    });
  }
})();
