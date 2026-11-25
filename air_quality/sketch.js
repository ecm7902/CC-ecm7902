const apiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=40.7143,48.8534,35.6895&longitude=-74.006,2.3488,139.6917&hourly=pm2_5,uv_index&timezone=auto&forecast_days=1';
// const apiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=40.7143&longitude=-74.006&hourly=pm2_5,uv_index&timezone=auto&forecast_days=1';
let uv_value;
let pm2_5_value;
let currentHour = new Date().getHours();
let balls = [];
let locations = [
  { name: 'New York', key: '1' },
  { name: 'Paris', key: '2' },
  { name: 'Tokyo', key: '3' }
];
let locationData = [];
let currentLocationIndex = 0;
let numBalls = 10;
let good = [];
let moderate = [];
let unhealthySensitive = [];
let unhealthy = [];
let veryUnhealthy = [];
let hazardous = [];



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  //less than 9 - green
  good = [color(0, 255, 0), color(50, 205, 50), color(152, 251, 152), color(144, 238, 144), color(154, 205, 50)];

  // 9 to 35.5 - yellow
  moderate = [color(255, 255, 0), color(255, 215, 0), color(255, 165, 0), color(250, 250, 210), color(255, 255, 224)];

  //35.5 to 55.5 - orange
  unhealthySensitive = [color(255, 140, 0), color(255, 165, 0), color(255, 99, 71), color(255, 127, 80), color(255, 160, 122)];

  //55.5 to 125.5 - light red
  unhealthy = [color(220, 20, 60), color(205, 92, 92), color(178, 34, 34), color(250, 128, 114), color(255, 0, 0)];

  //125.5 to 225.5 - dark red
  veryUnhealthy = [color(128, 0, 0), color(139, 0, 0), color(165, 42, 42), color(178, 34, 34), color(220, 20, 60)];

  //225.5 and above - purple
  hazardous = [color(128, 0, 128), color(75, 0, 130), color(138, 43, 226), color(147, 112, 219), color(186, 85, 211)];

  getData();

}

function createBalls() {
  balls = [];
  let viewportScale = constrain(min(width, height) / 768, 1, 2);

  for (let i = 0; i < numBalls; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(500, 900) * viewportScale;
    balls.push(new Ball(x, y, r));
  }
}


function draw() {
  for (let i=0; i<balls.length; i++) {
    balls[i].display();
    balls[i].move();
  }
  if (!fullscreen()) {
    drawInfoPanel();
  }
}

function drawInfoPanel() {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rect(16, 16, 350, 200, 12);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text(`Current location: ${locations[currentLocationIndex].name}`, 30, 28);
  text(`PM2.5: ${pm2_5_value ?? 'Loading...'}`, 30, 52);
  text(`UV Index: ${uv_value ?? 'Loading...'}`, 30, 76);

  textSize(13);
  text('Key commands:', 30, 110);
  text('Switch location: 1 New York  |  2 Paris  |  3 Tokyo', 30, 130);
  text('F: toggle fullscreen (hide/show info)', 30, 150);
  pop();
}

function keyPressed() {
  if (key.toLowerCase() === 'f') {
    fullscreen(!fullscreen());
    return false;
  }

  let selectedLocation = locations.findIndex(location => location.key === key);
  if (selectedLocation !== -1 && locationData.length > selectedLocation) {
    showLocation(selectedLocation);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (Number.isFinite(pm2_5_value)) {
    createBalls();
  }
}

function showLocation(index) {
  background(220);
  currentLocationIndex = index;
  uv_value = locationData[index].hourly.uv_index[currentHour];
  pm2_5_value = locationData[index].hourly.pm2_5[currentHour];
  updateUvBrightness();
  createBalls();
}

function updateUvBrightness() {
  if (!Number.isFinite(uv_value)) {
    return;
  }

  let brightness = map(constrain(uv_value, 0, 11), 0, 11, 0.65, 1.35);
  drawingContext.canvas.style.filter = `brightness(${brightness})`;
}

async function getData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Air quality request failed: ${response.status}`);
    }

    locationData = await response.json();
    if (!Array.isArray(locationData) || locationData.length !== locations.length) {
      throw new Error('Expected API data for New York, Paris, and Tokyo.');
    }

    showLocation(currentLocationIndex);
    console.log('Air Quality Data:', locationData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// function mousePressed() {
//   getData();
// }