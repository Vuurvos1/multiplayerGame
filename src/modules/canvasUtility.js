export default function getMouseCoordsOnCanvas(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);
  return { x: x, y: y };
}
