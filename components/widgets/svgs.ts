export function FlameSvg(color: string) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame-icon lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  `;
}

export function makeCircularProgressSvg(
  percent: number,
  textColor = "#ffffff",
  size = 150,
  stroke = 15,
  trackColor = "#b6b6b6",
  progressColor = "#3b90ff",
  showPercentText = true,
): string {
  const p = percent;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;
  const gap = c - dash;
  const cx = size / 2;
  const cy = size / 2;

  const textEl = showPercentText
    ? `<text
        x="${cx}"
        y="${cy}"
        fill="${textColor}"
        font-size="${size * 0.24}"
        font-weight="600"
        text-anchor="middle"
        dominant-baseline="middle"
        alignment-baseline="middle"
        dy=".35em"
     >${Math.round(p)}%</text>`
    : "";

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Track -->
  <circle
    cx="${cx}"
    cy="${cy}"
    r="${r}"
    fill="none"
    stroke="${trackColor}"
    stroke-width="${stroke}"
  />
  
  <!-- Progress Arc -->
  <circle
    cx="${cx}"
    cy="${cy}"
    r="${r}"
    fill="none"
    stroke="${progressColor}"
    stroke-width="${stroke}"
    stroke-dasharray="${dash} ${gap}"
    stroke-linecap="round"
  />
  
  ${textEl}
</svg>`;
}
