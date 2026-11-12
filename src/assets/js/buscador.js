// Mujer Medicina · buscador interno
// Se descarga recién cuando alguien abre el buscador. Busca sin distinguir acentos ni mayúsculas
// en un índice generado al compilar (/buscar.json). Teclado: ↑ ↓ para moverse, Enter para abrir.
(() => {
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let indice = null;
  const cargar = () => indice || (indice = fetch(document.body.dataset.searchIndex || "/buscar.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((items) => items.map((it) => ({ ...it, nt: norm(it.t), nd: norm(it.d), nx: norm(it.x) })))
    .catch((e) => { indice = null; throw e; }));

  // Resalta los términos buscados (comparando sin acentos, respetando el texto original)
  const resaltar = (texto, terminos) => {
    const n = norm(texto);
    const marcas = [];
    terminos.forEach((t) => { let i = n.indexOf(t); while (i !== -1 && t) { marcas.push([i, i + t.length]); i = n.indexOf(t, i + t.length); } });
    if (!marcas.length) return esc(texto);
    marcas.sort((a, b) => a[0] - b[0]);
    let out = "", pos = 0;
    marcas.forEach(([a, b]) => { if (a < pos) return; out += esc(texto.slice(pos, a)) + "<mark>" + esc(texto.slice(a, b)) + "</mark>"; pos = b; });
    return out + esc(texto.slice(pos));
  };

  const buscar = (items, q) => {
    const terminos = norm(q).split(/\s+/).filter((t) => t.length > 1);
    if (!terminos.length) return { terminos, res: [] };
    const res = items.map((it) => {
      let p = 0;
      for (const t of terminos) {
        const enT = it.nt.includes(t), enD = it.nd.includes(t), enX = it.nx.includes(t);
        if (!enT && !enD && !enX) return null; // todos los términos deben aparecer
        p += (enT ? 13 : 0) + (it.nt.startsWith(t) ? 8 : 0) + (enD ? 5 : 0) + (enX ? 2 : 0);
      }
      if (it.k === "Propuesta") p += 13; else if (it.k === "Laboratorio") p += 3;
      return { it, p };
    }).filter(Boolean).sort((a, b) => b.p - a.p).slice(0, 13);
    return { terminos, res };
  };

  const conectar = (form) => {
    if (form.dataset.listo) return;
    form.dataset.listo = "1";
    const input = form.querySelector("[data-buscador-input]");
    const lista = form.querySelector("[data-buscador-res]");
    const estado = form.querySelector("[data-buscador-estado]");
    const sug = form.querySelector("[data-buscador-sug]");
    let activo = -1, timer;
    lista.setAttribute("role", "listbox");
    lista.id = lista.id || `res-${Math.random().toString(36).slice(2, 7)}`;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-controls", lista.id);
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");

    const marcar = (i) => {
      const links = [...lista.querySelectorAll("a")];
      activo = Math.max(-1, Math.min(i, links.length - 1));
      links.forEach((a, k) => a.setAttribute("aria-selected", String(k === activo)));
      if (activo >= 0) { input.setAttribute("aria-activedescendant", links[activo].id); links[activo].scrollIntoView({ block: "nearest" }); }
      else input.removeAttribute("aria-activedescendant");
    };
    const pintar = async () => {
      const q = input.value.trim();
      if (sug) sug.hidden = q.length > 0;
      if (!q) { lista.innerHTML = ""; estado.textContent = ""; input.setAttribute("aria-expanded", "false"); return; }
      let items;
      try { items = await cargar(); }
      catch { estado.textContent = "No se pudo cargar el buscador. Probá de nuevo en un momento."; return; }
      const { terminos, res } = buscar(items, q);
      estado.textContent = res.length ? `${res.length} resultado${res.length === 1 ? "" : "s"}` : `Nada encontrado para «${q}». Probá con otra palabra, como temazcal, canto o altar.`;
      lista.innerHTML = res.map(({ it }, i) => `<li role="presentation"><a role="option" id="${lista.id}-${i}" href="${esc(it.u)}"><span class="buscador__tipo">${esc(it.k)}</span><strong>${resaltar(it.t, terminos)}</strong><small>${resaltar(it.d || "", terminos)}</small></a></li>`).join("");
      input.setAttribute("aria-expanded", String(res.length > 0));
      activo = -1;
    };
    input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(pintar, 90); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); marcar(activo + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); marcar(activo - 1); }
      else if (e.key === "Enter") {
        const a = lista.querySelectorAll("a")[activo >= 0 ? activo : 0];
        e.preventDefault();
        if (a) location.href = a.href;
      }
    });
    form.addEventListener("submit", (e) => e.preventDefault());
    // En /buscar/?q=… se busca al cargar
    const q0 = new URLSearchParams(location.search).get("q");
    if (q0 && !form.closest("dialog")) { input.value = q0; pintar(); }
    return { input, pintar };
  };

  // Página /buscar/
  document.querySelectorAll("[data-buscador]").forEach((f) => { if (!f.closest("dialog")) conectar(f); });

  // Diálogo
  const dlg = document.querySelector("[data-buscador-dlg]");
  if (dlg) {
    const form = dlg.querySelector("[data-buscador]");
    const ctl = conectar(form);
    window.__abrirBuscador = () => {
      if (!dlg.open) { dlg.showModal(); }
      ctl.input.focus(); ctl.input.select();
      cargar().catch(() => {});
    };
    dlg.querySelector("[data-buscador-cerrar]")?.addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }
})();
