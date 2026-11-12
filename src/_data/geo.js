// Geometría precalculada para las experiencias (se resuelve al compilar, no en el navegador)
const r2 = (n) => Math.round(n * 100) / 100;

// Generador pseudoaleatorio determinístico: mismo dibujo en cada compilación
const rand = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

const polar = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: r2(cx + r * Math.cos(a)), y: r2(cy + r * Math.sin(a)) };
};

// Polvo de estrellas: partículas dispersas que convergen en un anillo de luz
const rnd = rand(7);
const estrellas = Array.from({ length: 28 }, (_, i) => {
  const fin = polar(100, 100, 34 + (i % 3) * 6, (i / 28) * 360);
  return { x0: r2(rnd() * 200), y0: r2(rnd() * 200), x1: fin.x, y1: fin.y, r: r2(1 + rnd() * 1.8), d: r2(rnd() * 0.6) };
});

// Polvo que el tambor barre: repartido con el ángulo áureo (137,5°), como las semillas
// de un girasol. Cada mota gira 360°/φ² respecto de la anterior y se aleja según √n:
// así se distribuyen parejas, sin líneas ni huecos, de una forma que se siente natural.
const PHI = (1 + Math.sqrt(5)) / 2;
const ANGULO_AUREO = 360 / (PHI * PHI);
const rnd2 = rand(19);
const polvo = Array.from({ length: 21 }, (_, i) => {
  const p = polar(100, 100, 22 + 10 * Math.sqrt(i + 1), i * ANGULO_AUREO);
  return { x: p.x, y: p.y, r: r2(0.8 + rnd2() * 1.6) };
});

// Ronda: ocho lugares alrededor del fuego
const ronda = Array.from({ length: 8 }, (_, i) => polar(100, 100, 66, i * 45 - 90));

// Arcos del ciclo de cuatro encuentros (cada uno un cuarto de círculo)
const arco = (i) => {
  const a = polar(100, 100, 70, i * 90 - 90 + 3);
  const b = polar(100, 100, 70, (i + 1) * 90 - 90 - 3);
  return `M${a.x} ${a.y} A70 70 0 0 1 ${b.x} ${b.y}`;
};
const ciclo = [0, 1, 2, 3].map((i) => ({ d: arco(i), badge: polar(100, 100, 70, i * 90 - 45) }));

// Pléyades: siete estrellas y el orden en que se unen
const pleyades = [
  { x: 52, y: 58 }, { x: 92, y: 40 }, { x: 132, y: 62 }, { x: 118, y: 102 },
  { x: 80, y: 108 }, { x: 46, y: 140 }, { x: 150, y: 146 },
];
const pleyadesLineas = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [3, 6]];

export default { PHI: r2(PHI * 1000) / 1000, ANGULO_AUREO: r2(ANGULO_AUREO), estrellas, polvo, ronda, ciclo, pleyades, pleyadesLineas };
