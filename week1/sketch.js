// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!

const quotes = [
  { text: "when you write computer code to make something that is artistic.", source: "Holly" },
  { text: "\n 'to build things rather than stealing code or \n using already made code. More handmade.", source: "Allison" },
  { text: "with motion or telling a story.", source: "Caroline" },
  { text: "able to bring out the imagination.", source: "Sheila" },
  { text: "when you're creating every day.", source: "Tony" },
  { text: "writing a program for games or art.", source: "Annie" },
  { text: "a type of coding that portrays the coder's vibe or style.", source: "Taylor" },
  { text: "using traditional coding skills in a unique way for design or art.", source: "Ava" }
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable that holds the current quote
let current = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed with millis() so each page load gives a different quote.
  randomSeed(millis());
  textSize(32);
  fill(177, 231, 229);
  // calls the function to pick a quote
  pickQuote();
}

function pickQuote() {
  // take a random number and use that to identify what quote to use
  current = quotes[floor(random(quotes.length))];
}

function draw() {
  background(20, 48, 52); // set the background color
  drawQuote();  // draw the quote on screen
}

function drawQuote() {   // draw text
  textAlign(CENTER, CENTER);
  text("Creative Coding is.....", width / 2, height / 2 - 48);
  textStyle(BOLD);
  text("'" + current.text + "'", width / 2, height / 2);
  textAlign(RIGHT, CENTER);
  text("-" + current.source, width - 100, height - 100);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newQuote() {
  pickQuote();
  redraw();
}

function mousePressed() {
  newQuote();
}
