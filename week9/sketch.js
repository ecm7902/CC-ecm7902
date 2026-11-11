let video;
let handPose;
let hands = [];
let modelReady = false;

let notes = [];
let echo;
let audioStarted = false;
let startButton;

//C Major Pentatonic
const NOTES = [
  ["C4", 261.63], ["D4", 293.66], ["E4", 329.63], ["G4", 392.00], ["A4", 440.00],
  ["C5", 523.25], ["D5", 587.33], ["E5", 659.25], ["G5", 783.99], ["A5", 880.00]
];

async function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  startButton = createButton("Start sound");
  startButton.mousePressed(startAudio);

  handPose = await ml5.handPose({ flipped: true });
  handPose.detectStart(video, gotHands);
  modelReady = true;
}

function draw() {
  background(20);

  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  let colW = width / NOTES.length;
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(13);

  for (let i = 0; i < NOTES.length; i++) {
    if (i % 2 === 0) {
      fill(255, 18);
    } else {
      fill(255, 40);
    }
    rect(i * colW, 0, colW, height);
    fill(255, 200);
    text(NOTES[i][0], i * colW + colW / 2, height - 8);
  }

  for (let i = 0; i < 2; i++) {
    let hand = hands[i];
    let pinching = false;

    if (hand) {
      let index = hand.index_finger_tip;
      let thumb = hand.thumb_tip;

      let handSize = dist(hand.wrist.x, hand.wrist.y,
      hand.middle_finger_mcp.x, hand.middle_finger_mcp.y);
      pinching = dist(index.x, index.y, thumb.x, thumb.y) < handSize * 0.35;
      
      let midX = (index.x + thumb.x) / 2;
      let midY = (index.y + thumb.y) / 2;

      if (pinching && notes[i]) {
        let col = constrain(floor(midX / colW), 0, NOTES.length - 1);
        fill(180, 20, 220, 90);
        rect(col * colW, 0, colW, height);

        notes[i].osc.freq(NOTES[col][1], 0.02);
        notes[i].filter.freq(map(midY, 0, height, 4500, 300));
        notes[i].osc.amp(0.35, 0.03);
      }

      fill(180, 20, 220);
      circle(index.x, index.y, 20);
      fill(240, 160, 0);
      circle(thumb.x, thumb.y, 20);
    }

    if (!pinching && notes[i]) {
      notes[i].osc.amp(0, 0.1);
    }
  }
}

function gotHands(results) {
  hands = results;
}

function startAudio() {
  if (audioStarted) return;
  userStartAudio();

  echo = new p5.Delay();

  for (let i = 0; i < 2; i++) {
    let osc = new p5.Oscillator("triangle");
    let filter = new p5.LowPass();

    osc.disconnect();
    osc.connect(filter);
    filter.res(1);
    echo.process(filter, 0.3, 0.35, 2300);

    osc.amp(0);
    osc.start();
    notes.push({ osc, filter });
  }

  audioStarted = true;
  startButton.html("Sound on");
  startButton.attribute("disabled", "");
}
