let xPos;
let yPos;
let angle;
let saturation;
let brightness;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  noStroke();
  background(230);
  xPos = width / 2;
  yPos = height / 2;
  angle = 360/8;
  colorAngle = 360/8;
  saturation = 85;
  brightness = 90;

}

function draw() {
  background(230);
    angleMode(DEGREES);

    for (let i = 0; i < 8; i++) {
      push();
      translate(xPos, yPos);
      rotate(angle * i);
      fill(colorAngle * i, saturation, brightness, .5);
      noStroke();
      ellipse(100, 100, 250, 250);
      pop();
    }

      for (let i = 0; i < 8; i++) {
      push();
      translate(xPos, yPos);
      rotate(angle * i);
      fill(colorAngle * i, saturation, brightness, .5);
      noStroke();
      ellipse(300, 300, 250, 250);
      pop();
    }

  }


function mouseWheel() {
  angle += 1;
}

function mouseClicked() {
  saturation = random(20, 100);
  brightness = random(50, 100);
}