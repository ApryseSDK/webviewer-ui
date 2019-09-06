export const rotateRad = (cx, cy, x, y, radians) => {
  const s = Math.sin(radians);
  const c = Math.cos(radians);

  const nx = (c * (x - cx)) + (s * (y - cy)) + cx; // xcos(theta) + ysin(theta)
  const ny = (c * (y - cy)) - (s * (x - cx)) + cy; // -ysin(theta) + xcos(theta)

  return { x: nx, y: ny };
};

export const rotateDeg = (cx, cy, x, y, angle) => {
  const radians = (Math.PI / 180) * angle;
  const s = Math.sin(radians);
  const c = Math.cos(radians);

  const nx = (c * (x - cx)) + (s * (y - cy)) + cx;
  const ny = (c * (y - cy)) - (s * (x - cx)) + cy;

  return { x: nx, y: ny };
};
