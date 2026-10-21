
let zoomVal = 0; // 0 is clock only, 1 is clock and calendar
let lastWheel = 0;
let showLabels = true;


//defining the labels for the hours and months
const HOUR_LABELS = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

//to make the sketch responsive by changing the size of the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#001B24');

  const clockHeight = height * lerp(1, 0.5, zoomVal); 
  const calendarHeight = height - clockHeight;
  const daysInMonth = new Date(year(), month(), 0).getDate(); //to get the number of days in the current month

  //draws the clock and calendar rows with the heights
  //the rows are defined by arrays of first number, number of bars, current value, and the share of the panel height
  drawRows(0, clockHeight, [
    [0, 24, hour(), 0.60, HOUR_LABELS],
    [0, 60, minute(), 0.25, null],
    [0, 60, second(), 0.15, null],
  ]);
  drawRows(clockHeight, calendarHeight, [
    [1, 12, month(), 0.6, MONTH_LABELS],
    [1, daysInMonth, day(), 0.4, null],
  ]);

  //for the zoom this is to snap to the nearest view after the user stops scrolling
  if (millis() - lastWheel > 150) {
    let targetZoom;
    if (zoomVal > 0.5) {
      targetZoom = 1;
    } else {
      targetZoom = 0;
    }
    zoomVal = lerp(zoomVal, targetZoom, 0.15);
  }
}

//function to draw the rows of bars for one panel, takes in the y position, height of the panel, and an array of rows
function drawRows(panelY, panelH, rows) {

  let rowY = panelY;

  
  for (const [first, count, value, share, labels] of rows) {
    
    const barW = width / count;

    const barH = panelH * share;

    for (let n = first; n < first + count; n++) {
      const position = n - first;
      const x = (n - first) * barW;

      if (n <= value) {
        //no stroke for the filled bars
        noStroke();
        //gradient fill for the filled bars
        const gradient = drawingContext.createLinearGradient(x, 0, x + barW, 0);
        gradient.addColorStop(0, '#001B24');
        gradient.addColorStop(1, '#294B3B');
        drawingContext.fillStyle = gradient;
      } else {
        //stroke and solid fill for the unfilled bars
        stroke(1);
        stroke('#294b3b3b');
        drawingContext.fillStyle = '#001B24';
      }
      //drawing the bar
      rect(x, rowY, barW, barH);

      if (n===value){
        if (barH > 16) {

          if (showLabels) {

            let labelText;
            if (labels){
              labelText = labels[position];
            }else{
              labelText = n;
            }
           drawingContext.fillStyle = '#4b6d5d';
          drawingContext.font = '12px sans-serif';
          drawingContext.textAlign = 'center';
          drawingContext.textBaseline = 'bottom';
          drawingContext.fillText(labelText, x + barW / 2, rowY + barH - 4);
          }
        }
      }
    }
    rowY += barH;
  }
}

function mouseWheel(event) {
  zoomVal = zoomVal + event.delta / 400;

  if (zoomVal < 0) {
    zoomVal = 0;
  } 
  if (zoomVal > 1) {
    zoomVal = 1;
  }

  lastWheel = millis();
  return false;
}

function keyPressed() {
  if (key === ' ') {
    if (zoomVal > 0.5) {
      zoomVal = 0.49;
    } else {
      zoomVal = 0.51;
    }
    lastWheel = 0;
  }
}

function mousePressed() {
  if (showLabels) {
    showLabels = false;
  } else {
    showLabels = true;
  }
}