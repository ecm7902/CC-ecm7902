const PIXELS_PER_SECOND = 70;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  select("#play").mousePressed(togglePlay);
  select("#full").mousePressed(toggleFullscreen);

  // builds song buttons from songs.js.
  SONGS.forEach((item, index) => {
    createButton(item.title)
      .addClass("song")
      .parent("#songs")
      .mousePressed(() => loadSong(index));
  });
}

function draw() {
  background(235, 45, 8);

  if (!song) {
    fill(0, 0, 100);
    textAlign(CENTER, CENTER);
    text("Pick a song above.", width / 2, height / 2);
    return;
  }

  const time = currentTime();
  // Stop the transport and reset the button after the final note has finished.
  if (playing && time > song.duration + 0.5) {
    Tone.Transport.stop();
    playing = false;
    updatePlayButton();
  }

  drawNotes(time);
  select("#time").html(`${formatTime(time)} / ${formatTime(song.duration)}`);
}

function drawNotes(time) {
  const nowX = width * 0.65;

  song.notes.forEach(note => {
    const age = time - note.time;
    if (age < -0.5 || age > note.duration + 2) return;

    // MIDI pitch maps to vertical position
    // duration determines the oval length
    const y = map(note.midi, song.minP - 2, song.maxP + 2, height - 40, 40);
    const startX = nowX - age * PIXELS_PER_SECOND;
    const endX = nowX - (age - note.duration) * PIXELS_PER_SECOND;
    const x = (startX + endX) / 2;
    const noteHeight = 8 + note.velocity * 18;

    let opacity = age < 0 ? 0.25 : 1;
    if (age > note.duration) {
      opacity = max(0, 1 - (age - note.duration) / 2);
    }

    // Pitch sets color
    // Note duration sets the oval's width
    fill((note.midi % 12) * 30, 80, 100, opacity);
    ellipse(x, y, max(10, abs(endX - startX) + noteHeight), noteHeight);
  });
}

function mousePressed(event) {
  if (event.target.tagName === "CANVAS" && isFullscreen()) togglePlay();
}

function keyPressed() {
  if (key === " ") {
    togglePlay();
    return false;
  }
  if (key === "f" || key === "F") toggleFullscreen();
  if (keyCode === ESCAPE && isFullscreen()) toggleFullscreen();
}

function isFullscreen() {
  return document.body.classList.contains("fs");
}

function toggleFullscreen() {
  const enabled = !isFullscreen();
  document.body.classList.toggle("fs", enabled);
  if (enabled && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else if (!enabled && document.fullscreenElement) {
    document.exitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) document.body.classList.remove("fs");
});

function formatTime(seconds) {
  const minutes = floor(seconds / 60);
  const remainingSeconds = nf(floor(seconds % 60), 2);
  return `${minutes}:${remainingSeconds}`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}