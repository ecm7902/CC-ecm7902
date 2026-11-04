let capture;
let tiles = [];

const tileWidth = 320;
const tileHeight = 240;
const stepSize = 20;
const palettes = [
  {
    name: "Blue",
    colors: ["#173B50", "#397D9B", "#78B7CF", "#D6EAF0"],
  },
  {
    name: "Orange",
    colors: ["#542D3A", "#A64F45", "#E28A55", "#F5D29A"],
  },
  {
    name: "Teal",
    colors: ["#102D46", "#146B78", "#32AFA5", "#B6E5CB"],
  },
  {
    name: "Green",
    colors: ["#343D2F", "#667A3E", "#A4AE55", "#E2D994"],
  },
  {
    name: "Camera",
    adaptive: true,
  },
  {
    name: "Flowing",
    colors: ["#36265F", "#276E9B", "#42B8A0", "#F2C85B"],
    animated: true,
  },
];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  capture = await createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  tiles = palettes.map(() => createGraphics(tileWidth, tileHeight));
}

function draw() {
  background(18, 30, 40);
  capture.loadPixels();

  // to make sure the camera has provided all four values for every pixel.
  if (capture.pixels.length < capture.width * capture.height * 4) {
    return;
  }

  let columns;
    // Use a wide 3-by-2 grid if in landscape and a taller 2-by-3 grid if portrait
  if (width >= height) {
    columns = 3;
  } else {
    columns = 2;
  }
  const rows = palettes.length / columns;
  const tileW = width / columns;
  const tileH = height / rows;

  for (let tileIndex = 0; tileIndex < palettes.length; tileIndex++) {
    const palette = palettes[tileIndex];
    const paletteColors = palette.colors;
    const buffer = tiles[tileIndex];
    buffer.background(18, 30, 40);

    // Samples one pixel per stepSize-by-stepSize cell
    for (let y = 0; y < capture.height; y += stepSize) {
      for (let x = 0; x < capture.width; x += stepSize) {
        const sampleX = Math.min(x + stepSize / 2, capture.width - 1);
        const sampleY = Math.min(y + stepSize / 2, capture.height - 1);
        const i = (sampleY * capture.width + sampleX) * 4;
        const brightness =
          (capture.pixels[i] + capture.pixels[i + 1] + capture.pixels[i + 2]) /
          (3 * 255);
        const sourceColor = [
          capture.pixels[i],
          capture.pixels[i + 1],
          capture.pixels[i + 2],
        ];
        const wave = palette.animated
          ? 0.16 * sin(frameCount * 0.035 + x * 0.025 + y * 0.018)
          : 0;
        let threadColor;
        if (palette.adaptive) {
          // To keep the camera's sampled colors; preset tiles choose by brightness.
          threadColor = color(...sourceColor, 230);
        } else {
          const colorIndex = Math.min(
            paletteColors.length - 1,
            Math.floor(
              constrain(brightness + wave, 0, 0.999) * paletteColors.length
            ) 
          );
          threadColor = color(paletteColors[colorIndex]);
        }
        // Fill underneath each stitch so the canvas background doesn't show through
        const underlayColor = color(
          red(threadColor) * 0.62,
          green(threadColor) * 0.62,
          blue(threadColor) * 0.62
        );
        const drawX = (x / capture.width) * tileWidth;
        const drawY = (y / capture.height) * tileHeight;
        const cellW = (stepSize / capture.width) * tileWidth;
        const cellH = (stepSize / capture.height) * tileHeight;
        const stitchLength = Math.min(cellW, cellH) * 1.4;

        buffer.noStroke();
        buffer.fill(underlayColor);
        buffer.rect(drawX, drawY, cellW + 1, cellH + 1);

        // Draws a bottom-left-to-top-right stitch at the cell's center
        buffer.push();
        buffer.translate(drawX + cellW / 2, drawY + cellH / 2);
        buffer.stroke(threadColor);
        buffer.strokeWeight(
          palette.adaptive
            ? Math.min(cellW, cellH) * (0.3 + (1 - brightness) * 0.2)
            : Math.min(cellW, cellH) * 0.72
        );
        buffer.strokeCap(ROUND);
        buffer.line(
          -stitchLength / 2,
          stitchLength / 2,
          stitchLength / 2,
          -stitchLength / 2
        );
        buffer.pop();
      }
    }

    const column = tileIndex % columns;
    const row = Math.floor(tileIndex / columns);
    const tileAspect = tileW / tileH;
    const sourceAspect = tileWidth / tileHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceW = tileWidth;
    let sourceH = tileHeight;

    // maintains the aspect ratio of the tile
    if (tileAspect > sourceAspect) {
      sourceH = tileWidth / tileAspect;
      sourceY = (tileHeight - sourceH) / 2;
    } else {
      sourceW = tileHeight * tileAspect;
      sourceX = (tileWidth - sourceW) / 2;
    }

    image(
      buffer,
      column * tileW,
      row * tileH,
      tileW,
      tileH,
      sourceX,
      sourceY,
      sourceW,
      sourceH
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === "f") {
    fullscreen(!fullscreen());
  }
}
