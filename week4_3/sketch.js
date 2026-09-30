let sqSize, sqX, sqY;
let triPosX, triPosY;
let seed;
let doExport = false;


function setup() {
  createCanvas(576, 384);
  sqSize = 30;
  sqX = 0;
  sqY = 0;
  rectMode(CENTER);

  seed = 401692;
  randomSeed(seed);
 //125387
}

function keyPressed() {
  if (key == "s") {
    doExport = true;
    console.log("saved");
    console.log(doExport);
  }
}

function draw() {

  if (doExport = true) {
    beginRecordSvg("myOutput.svg");
  }

  background('white');   

  for(let x = 0; x < 20; x++){ 
        for(let y = 0; y < 10; y++){ 
            strokeWeight(1);
            push();
            translate(x*30, y*30);
            triPosX = map(sin(random()), -1, 1, -50, 200); 
            triPosY = map(cos(random()), -1, 1, -50, 200); 
            translate(triPosX-150, triPosY-150);
            scale(random(0.5, 2));
            noFill();
            triangle(0, 30, 0, 0, 30, 30);
            noLoop();
            pop();
        }
    }

    if (doExport) {
      endRecordSvg();
      doExport = false;
    }
}


