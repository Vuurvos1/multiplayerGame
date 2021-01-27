import Point from './canvasPointModel.js';

export default class Fill {
  constructor(canvas, point, color) {
    this.ctx = canvas.getContext('2d');

    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );

    const targetColor = this.getPixel(point);
    const fillColor = this.hexToRgba(color);

    this.fillStack = [];

    this.floodFill(point, targetColor, fillColor);
    this.fillColor();
  }

  floodFill(point, targetCol, fillCol) {
    if (this.colorMatch(targetCol, fillCol)) return;

    const currentCol = this.getPixel(point);

    if (this.colorMatch(currentCol, targetCol)) {
      this.setPixel(point, fillCol);

      // pixel right
      this.fillStack.push([
        new Point(point.x + 1, point.y),
        targetCol,
        fillCol,
      ]);

      // pixel left
      this.fillStack.push([
        new Point(point.x - 1, point.y),
        targetCol,
        fillCol,
      ]);

      // pixel down
      this.fillStack.push([
        new Point(point.x, point.y + 1),
        targetCol,
        fillCol,
      ]);

      // pixel up
      this.fillStack.push([
        new Point(point.x, point.y - 1),
        targetCol,
        fillCol,
      ]);
    }
  }

  fillColor() {
    if (this.fillStack.length > 0) {
      const range = this.fillStack.length;
      for (let i = 0; i < range; i++) {
        this.floodFill(
          this.fillStack[i][0],
          this.fillStack[i][1],
          this.fillStack[i][2]
        );
      }

      this.fillStack.splice(0, range);

      this.fillColor();
    } else {
      this.ctx.putImageData(this.imageData, 0, 0);
      this.fillStack = [];
    }
  }

  getPixel(point) {
    if (
      point.x < 0 ||
      point.y < 0 ||
      point.x > this.imageData.width ||
      point.y > this.imageData.height
    ) {
      return [-1, -1, -1, -1];
    } else {
      const offset = (point.y * this.imageData.width + point.x) * 4;

      return [
        this.imageData.data[offset],
        this.imageData.data[offset + 1],
        this.imageData.data[offset + 2],
        this.imageData.data[offset + 3],
      ];
    }
  }

  setPixel(point, fillCol) {
    const offset = (point.y * this.imageData.width + point.x) * 4;

    this.imageData.data[offset] = fillCol[0]; // red
    this.imageData.data[offset + 1] = fillCol[1]; // green
    this.imageData.data[offset + 2] = fillCol[2]; // blue
    this.imageData.data[offset + 3] = fillCol[3]; // alpha
  }

  colorMatch(a, b) {
    return a[0] == b[0] && a[1] == b[1] && a[3] == b[3] && a[3] == b[3];
  }

  hexToRgba(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return [r, g, b, 255];
  }
}
