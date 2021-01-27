<script>
  import { onMount } from 'svelte';
  import { q, qa } from './../../modules/helpers';
  import Paint from './../../modules/paint';
  import Fill from './../../modules/canvasFill';
  import { socket, paint } from './../../store';

  onMount(() => {
    const canvasId = '#canvas';
    $paint = new Paint(canvasId);

    // set defealt tools
    $paint.activeTool = 'brush';
    $paint.lineWidth = 3;
    $paint.selectColor = '#000000';

    // initialize paint
    $paint.init();

    const canvasEl = document.querySelector(canvasId);
    const ctx = canvasEl.getContext('2d');

    // doesn't work
    // get existing canvas
    $socket.on('requestCanvas', (data) => {
      const savedData = canvasEl.toDataURL();
      const sendData = {
        id: data.id,
        imgData: savedData,
      };

      $socket.emit('sendCanvas', sendData);
    });

    $socket.on('recieveCanvas', (data) => {
      // this triggers multiple times when more users are in a lobby for some reason but works
      let img = new Image();
      img.src = data.imgData;

      img.onload = function () {
        ctx.drawImage(img, 0, 0);
      };
    });

    $socket.on('floodFill', (data) => {
      new Fill(canvasEl, data.pos, data.col);
    });

    $socket.on('startStroke', (data) => {
      ctx.lineWidth = data.lineWidth;
      ctx.strokeStyle = data.color;
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    });

    $socket.on('drawStroke', (data) => {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    let undoStack = [];
    const undoLimit = 3;
    $socket.on('saveMove', (data) => {
      const savedData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );

      if (undoStack.length >= undoLimit) {
        undoStack.shift();
      }
      undoStack.push(savedData);
    });

    $socket.on('undoMove', (data) => {
      if (undoStack) {
        ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
        undoStack.pop();
      }
    });

    $socket.on('erase', (data) => {
      ctx.clearRect(data.x, data.y, lineWidth, lineWidth);
    });
  });
</script>

<canvas id="canvas" class={$$props.class} />
