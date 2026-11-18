let song = null;
let playing = false;
let masterVolume;
let loadId = 0; 
const samplers = {};
const SAMPLE_BASE = "https://nbrosowsky.github.io/tonejs-instruments/samples/";
const REVERB_WET = 0.6;

async function loadSong(index) {
  const thisLoad = ++loadId;
  const choice = SONGS[index];
  selectAll(".song").forEach((button, i) => button.elt.classList.toggle("active", i === index));
  select("#play").elt.disabled = true;
  select("#msg").html("Loading MIDI…");
  clearSong();

  try {
    const tracks = [];
    // gives every track its chosen instrument from songs.js 
    for (const file of choice.files) {
      const response = await fetch(file.url);
      if (thisLoad !== loadId) return;
      if (!response.ok) throw new Error(`Could not load ${file.url}: ${response.status}`);

      if (file.url.endsWith(".json")) {
        const data = await response.json();
        if (!Array.isArray(data.tracks)) throw new Error(`${file.url} has no tracks`);

        data.tracks.forEach((track, i) => {
          if (!track.notes.length || file.trackInstruments[i] === null) return;
          const instrument = file.trackInstruments[i];
          if (!instrument) throw new Error(`Choose an instrument for track ${i + 1} in songs.js`);
          tracks.push({ instrument, notes: track.notes });
        });
      } else {
        if (!file.instrument) throw new Error(`Choose an instrument for ${file.url} in songs.js`);
        const midi = new Midi(await response.arrayBuffer());
        midi.tracks
          .filter(track => track.notes.length && !track.instrument.percussion)
          .forEach(track => tracks.push({
            instrument: file.instrument,
            notes: track.notes.map(note => ({
              time: note.time,
              duration: note.duration,
              midi: note.midi,
              velocity: note.velocity
            }))
          }));
      }
    }
    if (thisLoad !== loadId) return;

    const notes = tracks.flatMap((track) =>
      track.notes.map(note => ({ ...note }))
    ).sort((a, b) => a.time - b.time);
    if (!notes.length) throw new Error(`${choice.title} has no playable notes`);
    if (notes.some(note =>
      !Number.isFinite(note.time) || !Number.isFinite(note.duration) ||
      !Number.isFinite(note.midi) || !Number.isFinite(note.velocity)
    )) {
      throw new Error(`${choice.title} contains an invalid MIDI note`);
    }

    const pitches = notes.map(note => note.midi);
    const loadedSong = {
      name: choice.title,
      tracks,
      notes,
      duration: Math.max(...notes.map(note => note.time + note.duration)),
      minP: Math.min(...pitches),
      maxP: Math.max(...pitches)
    };

    select("#msg").html("Loading instruments…");
    await loadInstruments([...new Set(tracks.map(track => track.instrument))]);
    if (thisLoad !== loadId) return;

    // Tone.Part schedules notes against Tone.Transport's shared clock
    song = loadedSong;
    select("#title").html(choice.title);
    tracks.forEach(track => {
      const sampler = samplers[track.instrument];
      track.part = new Tone.Part((time, note) => {
        const pitch = Tone.Frequency(note.midi, "midi").toNote();
        const scheduledTime = Number.isFinite(time) ? time : Tone.now();
        if (!Number.isFinite(time)) console.warn("Tone.Part gave an invalid time; playing this note immediately.");
        sampler.triggerAttackRelease(pitch, Math.max(0.08, note.duration), scheduledTime, note.velocity);
      }, track.notes.map(note => ({ time: note.time, ...note }))).start(0);
    });

    select("#msg").html("");
    select("#play").elt.disabled = false;
    updatePlayButton();
  } catch (error) {
    console.error(error);
    if (thisLoad !== loadId) return;
    clearSong();
    select("#msg").html(`Couldn't load ${choice.title}. Check the MIDI files, instrument names, and console.`);
  }
}

async function loadInstruments(names) {
  // Keep already-loaded samplers
  const missing = names.filter(name => !samplers[name]);
  if (!missing.length) return;

  if (typeof SampleLibrary === "undefined") {
    throw new Error("The Tone.js instrument sample library was not loaded");
  }
  ensureAudio();

  const library = SampleLibrary.load({ instruments: missing, baseUrl: SAMPLE_BASE });
  await Tone.loaded();

  missing.forEach(name => {
    const sampler = library[name];
    if (!sampler || !sampler.loaded) throw new Error(`Could not load the ${name} samples`);
    sampler.connect(masterVolume);
    samplers[name] = sampler;
  });
}

function ensureAudio() {
  if (masterVolume) return;

  // All samplers share this volume, reverb, and limiter output chain.
  // Should maybe come back to this later to improve quality, vary for different samplers
  const limiter = new Tone.Limiter(-2).toDestination();
  const reverb = new Tone.Reverb({ decay: 3.5, wet: REVERB_WET }).connect(limiter);
  masterVolume = new Tone.Volume(-4).connect(reverb);
}

function clearSong() {
  // Stop scheduled and dispose the old before loading another song.
  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.seconds = 0;
  Object.values(samplers).forEach(sampler => sampler.releaseAll());
  if (song) song.tracks.forEach(track => track.part?.dispose());
  song = null;
  playing = false;
  updatePlayButton();
}

async function togglePlay() {
  if (!song || select("#play").elt.disabled) return;
  await Tone.start();

  if (playing) {
    Tone.Transport.pause();
    Object.values(samplers).forEach(sampler => sampler.releaseAll());
    playing = false;
  } else {
    Tone.Transport.start("+0.1");
    playing = true;
  }
  updatePlayButton();
}

function updatePlayButton() {
  select("#play").html(playing ? "Pause" : "Play");
}

function currentTime() {
  const time = Tone.Transport.seconds;
  return playing ? Math.max(0, time - Tone.getContext().lookAhead) : time;
}
