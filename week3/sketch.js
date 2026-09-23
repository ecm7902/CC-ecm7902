let sqSize, sqX, sqY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  sqSize = 100;
  sqX = 0;
  sqY = 0;
  rectMode(CENTER);
}

function draw() {
  background(220);   

  for(let x = 0; x< 10; x++){ 
        for(let y= 0; y< 10; y++){ 
            fill(100, 50, 100);
            push();
            translate(x*100+100, y*100+100);
            rect(0,0,100,100);
            pop();

            push();
            fill(100, 80, 100);
            translate(x*100+50, y*100+50);
            triangle(0, 100, 0, 0, 100, 100);
            pop();
        }
    }
}

