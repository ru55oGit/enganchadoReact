// Redibuja el resultado de la partida en un canvas para compartirlo como
// imagen (navigator.share({ files: [...] })). No se clona el DOM real: los
// estilos de MUI (className hasheado por Emotion) no viajan a un canvas de
// forma confiable entre navegadores — mismo criterio que el resto del hub
// (ver shareImage.ts de letrisReact/viborealoReact/enroscaloReact). Se
// redibuja desde los mismos datos (chain/score) que ya usa la pantalla de
// game over.

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Mismo degradé que el fondo de toda la app (ver Layout/index.tsx), no un
// color aparte inventado para esta imagen.
const BG_GRADIENT_FROM = "#a34747";
const BG_GRADIENT_TO = "#F44336";
const COLOR_WHITE = "#ffffff";
const COLOR_MUTED = "rgba(255, 255, 255, 0.65)";
const ACCENT = "#e74c3c";
const CARD_LABEL_COLOR = "#888888";

// Textos ya formateados/traducidos por el caller (t.chainOfWords, etc.) —
// esta función no sabe de idiomas, solo dibuja.
export interface EnganchadoShareLabels {
  chainTitle: string; // ej "Cadena de 25 palabras"
  pointsLabel: string; // ej "359 puntos"
  chainSectionLabel: string; // ej "TU CADENA"
}

export async function buildEnganchadoResultPngFile(
  chain: string[],
  labels: EnganchadoShareLabels,
  filename: string,
): Promise<File | null> {
  const width = 560;
  const padding = 28;
  const chipHeight = 34;
  const chipGapX = 8;
  const chipGapY = 8;
  const headerHeight = 196;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Primera pasada: medir el ancho de cada chip (palabra en mayúscula) para
  // armar las filas (wrap) antes de saber el alto final del canvas.
  ctx.font = "bold 14px monospace";
  const maxRowWidth = width - padding * 2;
  const chips = chain.map((w, i) => {
    const label = w.toUpperCase();
    return { label, isFirst: i === 0, width: ctx.measureText(label).width + 24 };
  });

  const rows: (typeof chips)[] = [];
  let currentRow: typeof chips = [];
  let currentRowWidth = 0;
  for (const chip of chips) {
    const needed = currentRow.length === 0 ? chip.width : currentRowWidth + chipGapX + chip.width;
    if (needed > maxRowWidth && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [chip];
      currentRowWidth = chip.width;
    } else {
      currentRow.push(chip);
      currentRowWidth = needed;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  const rowsHeight = Math.max(rows.length, 1) * (chipHeight + chipGapY);
  // Card blanca detrás de la lista de palabras (label + chips), para que no
  // se pierdan contra el degradé rojo de fondo — mismo criterio que
  // letrisReact.
  const cardInset = 16;
  const cardTop = headerHeight - 40;
  const cardBottomNatural = headerHeight + rowsHeight + 16;
  // Con pocas palabras, altura mínima = ancho (queda cuadrada). Con muchas,
  // se estira hacia abajo lo que haga falta — la card crece para absorber
  // ese espacio extra, no queda un hueco de degradé abajo de una card chica.
  const height = Math.max(width, cardBottomNatural + 20);
  const cardBottom = height - 20;

  canvas.width = width;
  canvas.height = height;

  // Fondo: degradé de marca a todo el ancho/alto, sin bordes redondeados —
  // con border-radius, las esquinas fuera del redondeo quedan transparentes
  // y muchos visores las muestran blancas.
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, BG_GRADIENT_FROM);
  gradient.addColorStop(1, BG_GRADIENT_TO);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Título de marca, más grande.
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = "bold 40px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("www.enganchalo.com", width / 2, 50);

  // Cadena de N palabras + puntaje, centrados.
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(labels.chainTitle, width / 2, 98);

  ctx.fillStyle = COLOR_MUTED;
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(labels.pointsLabel.toUpperCase(), width / 2, 130);

  // Card blanca detrás de la lista.
  ctx.fillStyle = COLOR_WHITE;
  roundRectPath(ctx, cardInset, cardTop, width - cardInset * 2, cardBottom - cardTop, 16);
  ctx.fill();

  // Etiqueta de la lista.
  ctx.fillStyle = CARD_LABEL_COLOR;
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(labels.chainSectionLabel, padding, 176);

  // Chips de la cadena, en filas: la primera palabra (punto de partida) en
  // gris, el resto en rojo acento.
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  let y = headerHeight;
  for (const row of rows) {
    let x = padding;
    for (const chip of row) {
      const fillColor = chip.isFirst ? "rgba(107, 114, 128, 0.12)" : "rgba(231, 76, 60, 0.1)";
      const strokeColor = chip.isFirst ? "rgba(107, 114, 128, 0.4)" : "rgba(231, 76, 60, 0.35)";
      const textColor = chip.isFirst ? "#6b7280" : ACCENT;

      ctx.fillStyle = fillColor;
      roundRectPath(ctx, x, y, chip.width, chipHeight, 6);
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      roundRectPath(ctx, x, y, chip.width, chipHeight, 6);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText(chip.label, x + 12, y + chipHeight / 2 + 1);

      x += chip.width + chipGapX;
    }
    y += chipHeight + chipGapY;
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return null;

  return new File([blob], filename, { type: "image/png" });
}
