// Mujer Medicina · experiencias interactivas
// Se carga solo en páginas con [data-exp]. Cada experiencia se activa al entrar en pantalla.
// Con "reducir movimiento" todas muestran directamente su imagen final y siguen siendo usables.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Tambor de mano sintetizado (sin archivos de audio). Solo suena después de un toque.
     Imita las capas de un tambor real de cuero:
     - el golpe de la mano sobre el cuero (ruido muy corto y filtrado),
     - el cuerpo grave que resuena y baja de tono (la "panza" del tambor),
     - dos armónicos de la membrana, que se apagan antes,
     - la reverberación del espacio, como una ronda o un salón de madera.
     Alterna golpes al centro (graves y profundos) y al borde (más brillantes). */
  let audio, salida;
  const ruido = (ac, seg) => {
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * seg), ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  };
  const prepararSalida = (ac) => {
    // Reverberación: respuesta de impulso hecha con ruido que se apaga (sala cálida, ~1,6 s)
    const largo = Math.floor(ac.sampleRate * 1.6);
    const ir = ac.createBuffer(2, largo, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < largo; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / largo, 3.2);
    }
    const reverb = ac.createConvolver(); reverb.buffer = ir;
    const humedo = ac.createGain(); humedo.gain.value = 0.22;
    const seco = ac.createGain(); seco.gain.value = 0.9;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.25;
    const entrada = ac.createGain();
    entrada.connect(seco).connect(comp);
    entrada.connect(reverb).connect(humedo).connect(comp);
    comp.connect(ac.destination);
    return entrada;
  };
  const tamborGolpe = (ac, destino, t, { centro = true, fuerza = 1 } = {}) => {
    const v = fuerza * (0.92 + Math.random() * 0.16);   // cada golpe es un poco distinto, como con la mano
    const base = (centro ? 72 : 96) * (0.98 + Math.random() * 0.04);

    // 1. Cuerpo: tono grave que cae rápido al tono de reposo del cuero
    const cuerpo = ac.createOscillator(), gc = ac.createGain();
    cuerpo.type = "sine";
    cuerpo.frequency.setValueAtTime(base * 2.1, t);
    cuerpo.frequency.exponentialRampToValueAtTime(base * 1.08, t + 0.05);
    cuerpo.frequency.exponentialRampToValueAtTime(base, t + 0.6);
    gc.gain.setValueAtTime(0.0001, t);
    gc.gain.exponentialRampToValueAtTime(0.9 * v, t + 0.006);
    gc.gain.exponentialRampToValueAtTime(0.0001, t + (centro ? 1.5 : 0.9));
    cuerpo.connect(gc).connect(destino);
    cuerpo.start(t); cuerpo.stop(t + 1.6);

    // 2. Armónicos de la membrana (proporciones de un cuero circular: 1,59 y 2,14)
    [[1.59, 0.32], [2.14, 0.18]].forEach(([k, amp]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(base * k * 1.5, t);
      o.frequency.exponentialRampToValueAtTime(base * k, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp * v * (centro ? 0.7 : 1.3), t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(destino);
      o.start(t); o.stop(t + 0.4);
    });

    // 3. El golpe de la mano: ruido muy corto, filtrado como el sonido del cuero
    const n = ac.createBufferSource(); n.buffer = ruido(ac, 0.12);
    const bp = ac.createBiquadFilter(); bp.type = "bandpass";
    bp.frequency.value = centro ? 900 : 2200; bp.Q.value = 0.9;
    const gn = ac.createGain();
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime((centro ? 0.35 : 0.55) * v, t + 0.002);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + (centro ? 0.05 : 0.08));
    n.connect(bp).connect(gn).connect(destino);
    n.start(t); n.stop(t + 0.12);

    // 4. El aire que empuja el cuero: un "pum" sordo de baja frecuencia
    const p = ac.createBufferSource(); p.buffer = ruido(ac, 0.2);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 180;
    const gp = ac.createGain();
    gp.gain.setValueAtTime(0.0001, t);
    gp.gain.exponentialRampToValueAtTime(0.5 * v, t + 0.004);
    gp.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    p.connect(lp).connect(gp).connect(destino);
    p.start(t); p.stop(t + 0.2);
  };
  const golpe = (centro = true) => {
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      salida ||= prepararSalida(audio);
      tamborGolpe(audio, salida, audio.currentTime + 0.005, { centro });
    } catch { /* sin audio disponible: la experiencia sigue siendo visual */ }
  };

  const svgNS = "http://www.w3.org/2000/svg";
  const onda = (group, cls = "onda") => {
    if (reduce) return;
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", "100"); c.setAttribute("cy", "100"); c.setAttribute("r", "20");
    c.setAttribute("class", cls);
    group.appendChild(c);
    c.addEventListener("animationend", () => c.parentNode && c.parentNode.removeChild(c));
  };

  const init = {
    /* Escenas narrativas: se representan al entrar en pantalla (todo el trabajo lo hace el CSS) */
    escena() {},

    /* Tambor: cada golpe emite ondas que barren el polvo y encienden la chispa */
    tambor(root) {
      const btn = $("[data-tambor-golpe]", root);
      const estado = $("[data-tambor-estado]", root);
      const ondas = $(".tambor__ondas", root);
      const motas = $$(".tambor__polvo circle", root);
      const sonido = $("[data-tambor-sonido]", root);
      let conSonido = true, golpes = 0;
      const frases = ["Tocá el tambor", "Un latido", "La vibración crece", "El polvo se va", "Vibración que despierta"];
      sonido.addEventListener("click", () => {
        conSonido = !conSonido;
        sonido.setAttribute("aria-pressed", String(conSonido));
        sonido.textContent = conSonido ? "Sonido: sí" : "Sonido: no";
      });
      btn.addEventListener("click", () => {
        golpes = Math.min(golpes + 1, motas.length);
        if (conSonido) golpe(golpes % 3 !== 0); // dos al centro, uno al borde, como un pulso de ronda
        onda(ondas, "tambor__onda");
        btn.classList.remove("is-golpe"); void btn.offsetWidth; btn.classList.add("is-golpe");
        // Cada golpe barre una parte del polvo; con cinco golpes la chispa queda limpia
        const porGolpe = Math.ceil(motas.length / 5);
        motas.slice(0, Math.min(motas.length, golpes * porGolpe)).forEach((m) => m.classList.add("is-barrido"));
        const nivel = Math.min(4, Math.ceil(golpes * porGolpe / motas.length * 4));
        root.style.setProperty("--brillo", String(Math.min(1, golpes / 5)));
        estado.textContent = frases[nivel];
        root.classList.toggle("is-completo", golpes * porGolpe >= motas.length);
      });
    },

    /* Altar: colocar los cuatro elementos y moverlos donde se sienta */
    altar(root) {
      const stage = $("[data-altar-stage]", root);
      const estado = $("[data-altar-estado]", root);
      const lazo = $("[data-altar-lazo]", root);
      const items = Object.fromEntries($$("[data-altar-item]", root).map((b) => [b.dataset.altarItem, b]));
      const toggles = $$("[data-altar-toggle]", root);
      const inicio = { fuego: [50, 20], agua: [80, 50], aire: [20, 50], tierra: [50, 80] }; // en %
      const pos = {};

      const pintar = () => {
        const puestos = Object.keys(pos).filter((k) => !items[k].hidden);
        Object.entries(pos).forEach(([k, [x, y]]) => { items[k].style.left = `${x}%`; items[k].style.top = `${y}%`; });
        // El lazo une los elementos en el orden de la rueda, alrededor del centro
        const orden = puestos.map((k) => ({ k, a: Math.atan2(pos[k][1] - 50, pos[k][0] - 50) })).sort((p, q) => p.a - q.a);
        lazo.setAttribute("points", orden.map(({ k }) => `${pos[k][0] * 2},${pos[k][1] * 2}`).join(" "));
        const n = puestos.length;
        root.classList.toggle("is-completo", n === 4);
        root.style.setProperty("--tejido", String(n / 4));
        estado.textContent = n === 0 ? "Elegí un elemento" : n === 4 ? "Tu altar está activo" : `${n} de 4 elementos`;
      };

      toggles.forEach((t) => {
        t.addEventListener("click", () => {
          const id = t.dataset.altarToggle;
          const poner = items[id].hidden;
          items[id].hidden = !poner;
          t.setAttribute("aria-pressed", String(poner));
          if (poner) { pos[id] = pos[id] || [...inicio[id]]; items[id].classList.add("is-llega"); }
          pintar();
        });
      });

      // Arrastrar (mouse y táctil) dentro de la tela
      Object.entries(items).forEach(([id, el]) => {
        el.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          el.setPointerCapture(e.pointerId);
          el.classList.add("is-arrastrando");
          const mover = (ev) => {
            const r = stage.getBoundingClientRect();
            let x = ((ev.clientX - r.left) / r.width) * 100, y = ((ev.clientY - r.top) / r.height) * 100;
            // dentro del círculo de la tela
            const dx = x - 50, dy = y - 50, d = Math.hypot(dx, dy), max = 40;
            if (d > max) { x = 50 + (dx / d) * max; y = 50 + (dy / d) * max; }
            pos[id] = [x, y]; pintar();
          };
          const soltar = () => {
            el.classList.remove("is-arrastrando");
            el.removeEventListener("pointermove", mover);
          };
          el.addEventListener("pointermove", mover);
          el.addEventListener("pointerup", soltar, { once: true });
          el.addEventListener("pointercancel", soltar, { once: true });
        });
        // Teclado: flechas para mover
        el.addEventListener("keydown", (e) => {
          const paso = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key];
          if (!paso) return;
          e.preventDefault();
          let [x, y] = pos[id]; x += paso[0]; y += paso[1];
          const dx = x - 50, dy = y - 50, d = Math.hypot(dx, dy);
          if (d > 40) { x = 50 + (dx / d) * 40; y = 50 + (dy / d) * 40; }
          pos[id] = [x, y]; pintar();
        });
      });

      $("[data-altar-reset]", root).addEventListener("click", () => {
        Object.keys(items).forEach((k) => { items[k].hidden = true; delete pos[k]; });
        toggles.forEach((t) => t.setAttribute("aria-pressed", "false"));
        pintar();
      });
      pintar();
    },

    /* Ciclo de cuatro encuentros: tocar un elemento muestra su encuentro */
    ciclo(root) {
      const texto = $("[data-ciclo-texto]", root);
      const nombres = ["Fuego", "Agua", "Aire", "Tierra"];
      const original = texto.innerHTML;
      $$("[data-ciclo-nodo]", root).forEach((b) => {
        b.addEventListener("click", () => {
          const i = Number(b.dataset.cicloNodo);
          const activo = b.getAttribute("aria-pressed") === "true";
          $$("[data-ciclo-nodo]", root).forEach((o) => o.setAttribute("aria-pressed", "false"));
          root.removeAttribute("data-activo");
          if (activo) { texto.innerHTML = original; return; }
          b.setAttribute("aria-pressed", "true");
          root.setAttribute("data-activo", String(i));
          texto.innerHTML = `<span>Encuentro ${i + 1}</span><span>${nombres[i]}</span>`;
        });
      });
    },

    /* Secuencia paso a paso (temazcal) */
    pasos(root) {
      const textos = JSON.parse($("template[data-pasos]", root).innerHTML);
      const label = $("[data-paso-texto]", root);
      const dots = $$("[data-paso-ir]", root);
      const play = $("[data-paso-play]", root);
      let i = 0, timer = null;
      const ir = (n) => {
        i = (n + textos.length) % textos.length;
        root.dataset.paso = String(i);
        label.textContent = textos[i];
        dots.forEach((d, k) => (k === i ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current")));
      };
      const parar = () => { clearInterval(timer); timer = null; play.setAttribute("aria-pressed", "false"); play.textContent = "Ver la secuencia"; };
      const reproducir = () => {
        play.setAttribute("aria-pressed", "true"); play.textContent = "Pausar";
        ir(0);
        timer = setInterval(() => { if (i === textos.length - 1) return parar(); ir(i + 1); }, reduce ? 2500 : 2200);
      };
      $("[data-paso-prev]", root).addEventListener("click", () => { parar(); ir(i - 1); });
      $("[data-paso-next]", root).addEventListener("click", () => { parar(); ir(i + 1); });
      dots.forEach((d) => d.addEventListener("click", () => { parar(); ir(Number(d.dataset.pasoIr)); }));
      play.addEventListener("click", () => (timer ? parar() : reproducir()));
      root._alEntrar = () => { if (!reduce && !timer && i === 0) reproducir(); };
    },

    /* Ronda: cada voz se suma; al completarse, laten juntas */
    ronda(root) {
      const lugares = $$("[data-ronda-lugar]", root);
      const estado = $("[data-ronda-estado]", root);
      const sumar = $("[data-ronda-sumar]", root);
      const reset = $("[data-ronda-reset]", root);
      let n = 0;
      const pintar = () => {
        lugares.forEach((l, k) => l.classList.toggle("is-voz", k < n));
        root.style.setProperty("--ronda", String(n / lugares.length));
        root.classList.toggle("is-completa", n === lugares.length);
        estado.textContent = n === lugares.length ? "La ronda está completa" : n === 0 ? "Cada voz se suma" : `${n} voces en la ronda`;
        sumar.hidden = n === lugares.length;
        reset.hidden = n !== lugares.length;
      };
      sumar.addEventListener("click", () => { n = Math.min(n + 1, lugares.length); pintar(); if (n === lugares.length) reset.focus(); });
      reset.addEventListener("click", () => { n = 0; pintar(); sumar.focus(); });
      n = 2; pintar(); // la ronda empieza con dos voces esperando a las demás
    },

    /* Humo: el aire (el dedo o el cursor) lo inclina */
    humo(root) {
      const stage = $("[data-humo-stage]", root);
      const hilos = $$("[data-humo-hilo]", root);
      let viento = 0, objetivo = 0, t = 0, activo = false, raf;
      const dibujar = () => {
        t += 0.016;
        viento += (objetivo - viento) * 0.06;
        hilos.forEach((h, k) => {
          const base = 100 + (k - 1) * 6, fase = t * (0.8 + k * 0.2) + k;
          let d = `M${base} 150`;
          for (let s = 1; s <= 6; s++) {
            const y = 150 - s * 22;
            const lean = viento * s * s * 1.1;
            const x = base + Math.sin(fase + s * 0.9) * (reduce ? 0 : 3 + s) + lean;
            d += ` Q${x - 6} ${y + 11} ${x} ${y}`;
          }
          h.setAttribute("d", d);
        });
        if (activo) raf = requestAnimationFrame(dibujar);
      };
      const viewer = (e) => {
        const r = stage.getBoundingClientRect();
        objetivo = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)) * -1.4; // el humo se aparta de la brisa
      };
      stage.addEventListener("pointermove", viewer);
      stage.addEventListener("pointerleave", () => { objetivo = 0; });
      root._alEntrar = () => { activo = true; cancelAnimationFrame(raf); dibujar(); };
      root._alSalir = () => { activo = false; cancelAnimationFrame(raf); };
      dibujar();
    },

    /* Mandala tejido: avanza vuelta a vuelta con la lectura */
    tejido(root) {
      const vueltas = $$(".tejido__vuelta", root);
      const estado = $("[data-tejido-estado]", root);
      const barra = $("[data-tejido-barra]", root);
      if (reduce) { root.style.setProperty("--avance", "1"); estado.textContent = "Mandala completo"; barra.style.width = "100%"; return; }
      let ticking = false;
      const actualizar = () => {
        ticking = false;
        const r = root.getBoundingClientRect(), vh = innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.85)));
        vueltas.forEach((v, k) => {
          const local = Math.min(1, Math.max(0, p * vueltas.length - k));
          v.style.strokeDashoffset = String(1 - local);
        });
        barra.style.width = `${Math.round(p * 100)}%`;
        estado.textContent = p >= 1 ? "Mandala completo" : "Hilo a hilo";
      };
      addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(actualizar); } }, { passive: true });
      actualizar();
    },

    /* Pléyades: encender las siete estrellas */
    pleyades(root) {
      const estrellas = $$("[data-estrella]", root);
      const lineas = $$("[data-une]", root);
      const estado = $("[data-pley-estado]", root);
      const reset = $("[data-pley-reset]", root);
      const pintar = () => {
        const on = new Set(estrellas.filter((e) => e.getAttribute("aria-pressed") === "true").map((e) => e.dataset.estrella));
        lineas.forEach((l) => { const [a, b] = l.dataset.une.split("-"); l.classList.toggle("is-on", on.has(a) && on.has(b)); });
        const n = on.size;
        root.classList.toggle("is-completa", n === 7);
        estado.textContent = n === 7 ? "Las Siete Hermanas" : n === 0 ? "Encendé las siete" : `${n} de 7 estrellas`;
        reset.hidden = n === 0;
      };
      estrellas.forEach((e) => e.addEventListener("click", () => {
        e.setAttribute("aria-pressed", String(e.getAttribute("aria-pressed") !== "true")); pintar();
      }));
      reset.addEventListener("click", () => { estrellas.forEach((e) => e.setAttribute("aria-pressed", "false")); pintar(); });
    },

    /* Armonía: de la agitación a la calma */
    armonia(root) {
      const ondas = $$("[data-armonia-onda]", root);
      const rango = $("[data-armonia-rango]", root);
      const estado = $("[data-armonia-estado]", root);
      let t = 0, activo = false, raf;
      const dibujar = () => {
        t += 0.02;
        const calma = rango.value / 100;
        ondas.forEach((o, k) => {
          const amp = (1 - calma) * (26 - k * 5) + 2;
          const freq = (1 - calma) * 3 + 1;
          let d = "";
          for (let x = 10; x <= 290; x += 6) {
            const caos = (1 - calma) * Math.sin(x * 0.13 + t * 3 + k) * 8;
            const y = 70 + Math.sin((x / 280) * Math.PI * 2 * freq + t * (reduce ? 0 : 1.2) + k * 0.8) * amp + caos;
            d += `${x === 10 ? "M" : "L"}${x} ${y.toFixed(1)} `;
          }
          o.setAttribute("d", d);
        });
        root.style.setProperty("--calma", String(calma));
        estado.textContent = calma > 0.95 ? "Calma" : calma > 0.5 ? "Aquietando" : "Agitación";
        if (activo && !reduce) raf = requestAnimationFrame(dibujar);
      };
      rango.addEventListener("input", () => { if (reduce || !activo) dibujar(); });
      root._alEntrar = () => { activo = true; cancelAnimationFrame(raf); dibujar(); };
      root._alSalir = () => { activo = false; cancelAnimationFrame(raf); };
      dibujar();
    },

    /* Respiración guiada: 4 segundos inhalar, 4 exhalar, durante un minuto */
    respiracion(root) {
      const btn = $("[data-resp-btn]", root);
      const texto = $("[data-resp-texto]", root);
      let timer = null, fin = null;
      const parar = (msg = "Una pausa") => {
        clearInterval(timer); clearTimeout(fin); timer = null;
        root.classList.remove("is-inhala", "is-exhala", "is-activa");
        btn.setAttribute("aria-pressed", "false"); btn.textContent = "Respirar un minuto";
        texto.textContent = msg;
      };
      const fase = (inhala) => {
        root.classList.toggle("is-inhala", inhala); root.classList.toggle("is-exhala", !inhala);
        texto.textContent = inhala ? "Inhalá" : "Exhalá";
      };
      btn.addEventListener("click", () => {
        if (timer) return parar();
        root.classList.add("is-activa");
        btn.setAttribute("aria-pressed", "true"); btn.textContent = "Detener";
        let inhala = true; fase(inhala);
        timer = setInterval(() => { inhala = !inhala; fase(inhala); }, 4000);
        fin = setTimeout(() => parar("Gracias por esta pausa"), 64000);
      });
    },

    /* Palabras: girar para descubrir en inglés */
    palabras(root) {
      const estado = $("[data-palabras-estado]", root);
      const cartas = $$("[data-palabra]", root);
      cartas.forEach((c) => c.addEventListener("click", () => {
        c.setAttribute("aria-pressed", String(c.getAttribute("aria-pressed") !== "true"));
        const n = cartas.filter((x) => x.getAttribute("aria-pressed") === "true").length;
        estado.textContent = n === 4 ? "Four elements" : n === 0 ? "Tocá para traducir" : `${n} de 4`;
      }));
    },
  };

  /* Activación al entrar en pantalla */
  const roots = $$("[data-exp]");
  roots.forEach((root) => { try { init[root.dataset.exp]?.(root); } catch (err) { console.error(err); } });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const root = e.target;
      if (e.isIntersecting) {
        root.classList.add("is-en-escena");
        root._alEntrar?.();
      } else {
        root._alSalir?.();
      }
    });
  }, { threshold: 0.35 });
  roots.forEach((r) => io.observe(r));
})();
