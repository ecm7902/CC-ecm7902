//GLOBAL VARIABLES
let columns = 3;
let rows = 4;
let rect_width = 246;
let rect_height = 504;
let max_per_cell = 10;
let pMapper;
let quads = [];
let balls = [];
let showNumbers = true;

// BALL CLASS AND CONSTRUCTOR
class Ball{
  constructor(cell, x, y, vx, vy){
    this.cell = cell; // the ball's rectangle 
    this.x = x; // ball's x pos
    this.y = y; // ball's y pos
    this.vx = vx; //velocity on x axis
    this.vy = vy; // velocity on y axis
    this.r = 15; // radius
    this.offset = random(TWO_PI);
  }

  move(){
    let s = 1+.5 * sin(frameCount * .05 + this.offset);
    this.x += this.vx*s;
    this.y += this.vy*s;

  //for each wall bounce away at a random speed and add a ball
    if (this.x < this.r){
      this.x = this.r;
      this.vx = random(1,3);
      addBall(this, -1, 0);
    }
    
    if (this.x > rect_width-this.r){
      this.x = rect_width-this.r;
      this.vx = -random(1,3);
      addBall(this, 1, 0);
    }
    
    if (this.y < this.r){
      this.y = this.r;
      this.vy = random(1,3);
      addBall(this, 0, -1);
    }
    
    if (this.y > rect_height-this.r){
      this.y = rect_height-this.r;
      this.vy = -random(1,3);
      addBall(this, 0, 1);
    }
    
  }

  show(mySketch){
    mySketch.fill(190, 60, 100);
    mySketch.circle(this.x, this.y, this.r*2);
  }

}

// SETUP FUNCTION
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  pMapper = createProjectionMapper(this);

  for(let i = 0; i < columns * rows; i++){
    quads.push(pMapper.createQuadMap(rect_width, rect_height, 10, 20));

  }

  startOver();
  
}

// DRAW FUNCTION
function draw() {
  background('black');

  let count = balls.length;
  for (let i=0; i<count; i++){
    balls[i].move();
  }

  for (let i =0; i<quads.length; i++) {
        quads[i].displaySketch(function(mySketch){
            drawCell(mySketch, i);
          });
  }
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function startOver(){
balls = [];
  balls.push(new Ball(4 + 3 * floor(random(2)), rect_width / 2, rect_height / 2, 2, 1.5));

}

function drawCell(mySketch, i){ 
  mySketch.background(0);
  mySketch.colorMode(HSB);
  mySketch.noStroke();

  if (showNumbers) {
    mySketch.fill(0, 0, 100);
    mySketch.textSize(150);
    mySketch.textAlign(CENTER, CENTER);
    mySketch.text(i + 1, rect_width / 2, rect_height / 2);
  }

  for (let b of balls) {
    if (b.cell == i) {
      b.show(mySketch);
    }
  }

}

//dx and dy are saying which wall was hit 
// -1, 0 left, 1,0 right, 0, -1 top, 0,1 bottom
function addBall(b, dx, dy){
  let col = b.cell % columns + dx;
  let row = floor(b.cell / columns) + dy;

  if (col >= 0 && col < columns && row >= 0 && row < rows) {
    let x = b.x;
    let y = b.y;
    let vx = random(-3, 3);
    let vy = random(-3, 3);
    if (dx != 0) { x = rect_width - b.x; vx = dx * random(1, 3); }
    if (dy != 0) { y = rect_height - b.y; vy = dy * random(1, 3); }
    let cell = row * columns + col;
    if (countBalls(cell) < max_per_cell) {
      balls.push(new Ball(cell, x, y, vx, vy));
    }
  } else {
    if (countBalls(b.cell) < max_per_cell) {
      balls.push(new Ball(b.cell, rect_width / 2, rect_height / 2, random(-3, 3), random(-3, 3)));
    }
  }

}

function countBalls(cell){
    let n = 0;
  for (let b of balls) {
    if (b.cell == cell) n++;
  }
  return n;

}

function keyPressed(){
  if (key == "c") pMapper.toggleCalibration();
  if (key == "s") pMapper.save("map.json");
  if (key == "l") pMapper.load("maps/map.json");
  if (key == "n") showNumbers = !showNumbers;
  if (key == "r") startOver();
  if (key == "f") fullscreen(!fullscreen());
}