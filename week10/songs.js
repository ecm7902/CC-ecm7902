const SONGS = [
  { title: "Clair de Lune", 
    composer: "Claude Debussy",
    files: [{ url: "assets/debussy.mid", 
    instrument: "piano" }]},

  { title: "Prelude - Bach's Cello Suite No. 1 in G major", 
    composer: "Johann Sebastian Bach",
    files: [{ url: "assets/bwv1007.mid", 
    instrument: "cello" }]},

  { title: "Dancing Queen", 
    composer: "ABBA",
    files: [{
    url: "assets/abba.json",
    trackInstruments: [
        "bass-electric",
        "piano",
        "piano",
        "violin",
        "piano",
        "harmonium",
        "piano",
        "piano",
        null, //no drums
        "piano"
      ]
    }] }
];
