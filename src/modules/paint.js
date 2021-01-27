import { get } from 'svelte/store';
import { socket } from './../store';
import { q, qa } from './helpers';

import getMouseCoordsOnCanvas from './canvasUtility';
import Fill from './canvasFill';

// limit imput rate to requestAnimationFrame (should be same as screen refresh rate)
// might want to lock this to ~90 inputs per second
let drawFrame = true;
function animate() {
  drawFrame = true;

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

export default class Paint {
  constructor(canvasId) {
    this.canvas = q(canvasId);
    this.ctx = canvas.getContext('2d');

    this.undoStack = [];
    this.undoLimit = 3; // max 3 undo moves
  }

  set activeTool(tool) {
    this.tool = tool;
  }

  set lineWidth(lineWidth) {
    // _ to prevent conflict
    this._lineWidth = lineWidth;
    this.ctx.lineWidth = this._lineWidth;
  }

  set selectColor(col) {
    this.color = col;
    this.ctx.strokeStyle = this.color;
  }

  init() {
    this.canvas.onmousedown = (e) => this.onMouseDown(e);
    // ensure right canvas scale (width and height)
    this.canvas.width = this.canvas.getBoundingClientRect().width;
    this.canvas.height = this.canvas.getBoundingClientRect().height;

    this.ctx.lineWidth = 3;
  }

  onMouseDown(e) {
    this.savedData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );

    if (this.undoStack.length >= this.undoLimit) {
      this.undoStack.shift();
    }
    this.undoStack.push(this.savedData);

    this.canvas.onmousemove = (e) => this.onMouseMove(e);
    document.onmouseup = (e) => this.onMouseUp(e);

    this.startPos = getMouseCoordsOnCanvas(this.canvas, e);

    // save array to other clients
    get(socket).emit('saveMove', true);

    let data = {};
    switch (this.tool) {
      case 'brush':
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPos.x, this.startPos.y);

        // send event to server
        data = {
          x: this.startPos.x,
          y: this.startPos.y,
          lineWidth: this.lineWidth,
          color: this.color,
        };

        get(socket).emit('startStoke', data);
        break;

      case 'fill':
        new Fill(this.canvas, this.startPos, this.color);

        // send event to server
        data = {
          pos: this.startPos,
          col: this.color,
        };

        get(socket).emit('floodFill', data);
        break;

      case 'erase':
        this.ctx.clearRect(
          this.startPos.x,
          this.startPos.y,
          this._lineWidth,
          this._lineWidth
        );

        // send event to server
        data = {
          x: this.currentPos.x,
          y: this.currentPos.y,
        };

        get(socket).emit('erase', data);
        break;
    }
  }

  onMouseMove(e) {
    // Limit mouse move events
    if (!drawFrame) return;
    drawFrame = false;

    this.currentPos = getMouseCoordsOnCanvas(this.canvas, e);

    let data = {};
    switch (this.tool) {
      case 'brush':
        this.drawFreeLine();

        // send event to server
        data = {
          x: this.currentPos.x,
          y: this.currentPos.y,
        };

        get(socket).emit('drawStroke', data);
        break;
      case 'erase':
        this.ctx.clearRect(
          this.currentPos.x,
          this.currentPos.y,
          this._lineWidth,
          this._lineWidth
        );

        // send event to server
        data = {
          x: this.currentPos.x,
          y: this.currentPos.y,
          lineWidth: this.lineWidth,
          color: this.color,
        };

        get(socket).emit('erase', data);
        break;
    }
  }

  onMouseUp(e) {
    this.canvas.onmousemove = null;
    document.onmouseup = null;
  }

  drawFreeLine() {
    this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
    this.ctx.stroke();
  }

  undoMove() {
    if (this.undoStack.length > 0) {
      this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
      this.undoStack.pop();
    } else {
      // no undos availible
    }
  }
}
