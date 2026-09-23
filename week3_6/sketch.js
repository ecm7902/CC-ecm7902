let sqSize, sqX, sqY;
let emeraldGreen, mossGreen, sageGreen, petalPink, skyBlue;
let from, to, interA, interB;
let triPosX, triPosY;

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
  skyBlue = color(220, 46, 93, .5);

  from = skyBlue;
  to = petalPink;

}

function draw() {
  background(skyBlue);   

  for(let x = 0; x < 10; x++){ 
        for(let y = 0; y < 10; y++){ 
            strokeWeight(0);

            push();
            fill(skyBlue);

            let cellW = 100;
            let cellH = 100;
            let posX = x * cellW;
            let posY = y * cellH;
          
            if (mouseX > posX && mouseX < posX + cellW &&
                      mouseY > posY && mouseY < posY + cellH) {
                  fill(220, 46, 93, 1); 
                } else {
                  fill(220, 46, 93, .5); 
                }

            translate(x*100+100, y*100+100);
            rect(0,0,100,100);
            pop();

            push();
            interB = lerpColor(from, to, (x+y)/7);
            translate(x*100+50, y*100+50);
            triPosX = map(sin(frameCount * 0.009), -1, 1, -50, 200); 
            triPosY = map(cos(frameCount * 0.008), -1, 1, -50, 200); 
            translate(triPosX, triPosY);
            scale(map(sin(frameCount * 0.005), -1, 1, 1, 4)); 
            fill(interB);
            triangle(0, 100, 0, 0, 100, 100);
            pop();
        }
    }
}

