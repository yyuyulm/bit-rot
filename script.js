const drawDimension = 80;
const seed = 10;
const startDate = new Date(1968, 11, 9, 12);
const size = 0.6;

const pixelCount = drawDimension ** 2;
const intCount = pixelCount * 3;
const bitCount = intCount * 8;

const bits = new Uint8Array(bitCount);
const ints = new Uint8Array(intCount);
let currentSeed = seed;
let appliedRots = 0;

const canvas = document.getElementById('art');
const ctx = canvas.getContext('2d', { alpha: false });
const sourceCanvas = document.createElement('canvas');
sourceCanvas.width = drawDimension;
sourceCanvas.height = drawDimension;
const sourceCtx = sourceCanvas.getContext('2d', { alpha: false });
const sourceImage = sourceCtx.createImageData(drawDimension, drawDimension);

const datetimeEl = document.getElementById('datetime');
const rotsEl = document.getElementById('rots');

function fract(value) {
  return value - Math.floor(value);
}

function myRand(value) {
  return fract(Math.sin(value * 12.9898) * 43758.5453);
}

function bitToInt(offset) {
  let value = 0;
  for (let i = 0; i < 8; i += 1) {
    value += bits[offset + i] * 2 ** (7 - i);
  }
  return value;
}

function rot(targetRots) {
  if (targetRots < appliedRots) {
    bits.fill(0);
    currentSeed = seed;
    appliedRots = 0;
  }

  while (appliedRots < targetRots) {
    const rand = myRand(currentSeed) * bitCount;
    bits[Math.floor(rand)] ^= 1;
    currentSeed = rand;
    appliedRots += 1;
  }
}

function renderArt(now) {
  const rotIteration = (now.getTime() - startDate.getTime()) / 86400000;
  const targetRots = Math.max(0, Math.floor(rotIteration));

  rot(targetRots);

  for (let i = 0; i < intCount; i += 1) {
    ints[i] = bitToInt(i * 8);
  }

  const data = sourceImage.data;
  for (let i = 0; i < pixelCount; i += 1) {
    const sourceOffset = i * 3;
    const pixelOffset = i * 4;
    data[pixelOffset] = ints[sourceOffset];
    data[pixelOffset + 1] = ints[sourceOffset + 1];
    data[pixelOffset + 2] = ints[sourceOffset + 2];
    data[pixelOffset + 3] = 255;
  }

  sourceCtx.putImageData(sourceImage, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sourceCanvas, 0, 0, drawDimension, drawDimension, 0, 0, canvas.width, canvas.height);

  datetimeEl.textContent = now.toLocaleString();
  rotsEl.textContent = targetRots.toLocaleString();
}

function resizeCanvas() {
  const displayDimension = Math.max(1, Math.floor(size * Math.min(window.innerWidth, window.innerHeight)));
  canvas.width = displayDimension;
  canvas.height = displayDimension;
}

function update() {
  renderArt(new Date());
}

resizeCanvas();
update();
window.addEventListener('resize', () => {
  resizeCanvas();
  update();
});
setInterval(update, 1000);
