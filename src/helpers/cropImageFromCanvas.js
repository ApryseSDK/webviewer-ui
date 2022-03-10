
// Crops the image more accurately by removing white space from all side of the image.
function cropImageFromCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width;
  let height = canvas.height;
  const pixels = { x:[], y:[] };
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  let x;
  let y;
  let index;

  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      index = (y * width + x) * 4;
      if (imageData.data[index+3] > 0) {
        pixels.x.push(x);
        pixels.y.push(y);
      }
    }
  }
  pixels.x.sort(function(a,b) {
    return a-b;
  });
  pixels.y.sort(function(a,b) {
    return a-b;
  });
  const n = pixels.x.length-1;

  width = 1 + pixels.x[n] - pixels.x[0];
  height = 1 + pixels.y[n] - pixels.y[0];
  const cut = ctx.getImageData(pixels.x[0], pixels.y[0], width, height);

  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(cut, 0, 0);

  return canvas.toDataURL();
}

export default cropImageFromCanvas;