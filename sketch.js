let drawDimention = 80;
let seed = 10;
let startDate = new Date(1968,11,9,12);
let size = 0.6;

let bits = [];
let ints = [];
let cnv;
let img;
let displayDimention = 500;
let currentDate;
let rotIteration = 0;
let currentSeed;
let pixelCount = drawDimention**2;
let intCount = pixelCount*3;
let bitCount = intCount*8;
let timetext
let rottext

function iniBits(){
  for(let i=0; i < bitCount; i++){
    bits[i]=0;
  }
}

function myRand(co = createVector (0,0)){
  let result = fract(sin(co.dot(createVector(12.9898, 78.233))) * 43758.5453);
  return result;
}

function getRotInteration(){
  currentDate = new Date(year(),month(),day(),hour(),minute(),second(),millis());
  let mili = currentDate.getTime()-startDate.getTime();
  rotIteration = mili/86400000;
}

function updateText() {
  currentDateTime = currentDate.toLocaleString();
  timetext.elt.textContent = currentDateTime;
  rots = floor(rotIteration).toLocaleString();
  rottext.elt.textContent = rots;
}

function rotBit(){
  let rand = myRand(createVector (currentSeed,0))*bitCount;
  let randInt = Math.floor(rand);
  bits[randInt] = 1-bits[randInt];
  currentSeed = rand;
}

function bitToInt(bit8){
  let val = 0;
  for(let i=0; i < 8;i++){
    val += bit8[i] * 2**(7-i);
  }
  return val;
}

function bitsToInts(){
  for(let i=0; i < intCount; i++){
    ints[i] = bitToInt(bits.slice(i*8,i*8+8));
  }
}

function drawBits(){
  for(let i=0; i< pixelCount;i++){
    img.pixels[i*4] = ints[i*3];
    img.pixels[i*4+1] = ints[i*3+1];
    img.pixels[i*4+2] = ints[i*3+2];
    img.pixels[i*4+3]=255;
  }
  img.updatePixels();
}

function setup() {
  displayDimention = size * min(windowWidth,windowHeight);
  cnv = createCanvas(displayDimention, displayDimention);
  cnv.id('sketch');

  noSmooth();
  frameRate(1);
  //noLoop();
  pixelDensity(1);
  
  img = createImage(drawDimention,drawDimention);
  img.loadPixels();

  timetext = select('#datetime')
  rottext = select('#rots')
}

function draw() {
  iniBits();
  getRotInteration();
  currentSeed = seed;
  for(let i=0; i<rotIteration; i++){
    rotBit();
  }
  bitsToInts();
  drawBits();
  image(img,0,0,displayDimention,displayDimention, 0.25, 0.25, 79.5, 79.5);
  updateText();
}

function windowResized() {
  displayDimention = size * min(windowWidth,windowHeight);
  resizeCanvas(displayDimention, displayDimention);
}
