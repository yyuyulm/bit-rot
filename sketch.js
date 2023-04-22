let bits = [];
let drawDimention = 80;
let displayDimention = 500;

let img;

function drawBits(img){
  img.loadPixels();
  for(i=0; i< img.pixels.length;i+=4){
    img.pixels[i]=random(0,255);
    img.pixels[i+1]=random(0,255);
    img.pixels[i+2]=random(0,255);
    img.pixels[i+3]=255;
  }
  img.updatePixels();
}

function setup() {
  createCanvas(displayDimention, displayDimention)
  background(255);
  noSmooth();
  noLoop();
  
  img = createImage(drawDimention,drawDimention);
  drawBits(img);
}

function draw() {
  image(img,0,0,displayDimention,displayDimention, 0.25, 0.25, 79.5, 79.5);
}