let sqSize, sqX, sqY;
let emeraldGreen, mossGreen, sageGreen, petalPink;
let from, to, interA, interB;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  sqSize = 100;
  sqX = 0;
  sqY = 0;
  rectMode(CENTER);
  emeraldGreen = color(160, 96, 45);
  mossGreen = color(148, 36, 53);
  sageGreen = color(117, 22, 70, .75);
  petalPink = color(307, 37, 76, .5);

  from = sageGreen;
  to = petalPink;

}

function draw() {
  background(220);   

  for(let x = 0; x < 20; x++){ 
        for(let y = 0; y < 20; y++){ 
            strokeWeight(0);
            interA = lerpColor(from, to, x/20);
            interB = lerpColor(from, to, y/20);
            
            push();
            translate(x*100+100, y*100+100);
            fill(interA);
            rect(0,0,100,100);
            pop();

            push();
            translate(x*100+50, y*100+50);
            fill(interB);
            triangle(0, 100, 0, 0, 100, 100);
            pop();
        }
    }
}


