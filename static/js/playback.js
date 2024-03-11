audioContext = null;

// Map the note to its corresponding frequency
var frequencyMap = {
  C3: 130.81,
  "C#3": 138.59,
  Db3: 138.59,
  D3: 146.83,
  "D#3": 155.56,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.0,
  Gb3: 185.0,
  G3: 196.0,
  "G#3": 207.65,
  Ab3: 207.65,
  A3: 220.0,
  "A#3": 233.08,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  "C#4": 277.18,
  Db4: 277.18,
  D4: 293.66,
  "D#4": 311.13,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  Gb4: 369.99,
  G4: 392.0,
  "G#4": 415.3,
  Ab4: 415.3,
  A4: 440.0,
  "A#4": 466.16,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
};

function playSong(notes, beatsPerMinute) {
  const oscillator = setupOscillator();
  const noteArray = notes.split(",");
  const noteDuration = 60000 / beatsPerMinute;
  let paused = false;
  let noteI = 0;
  let stopped = false;

  const interval = setInterval(() => {
    if (paused || stopped) {
      return;
    }

    if (noteI >= noteArray.length) {
      clearInterval(interval);
      stopPlayback(oscillator);
      stopped = true;
      return;
    }

    const note = noteArray[noteI];
    noteI++;

    playNote(note, oscillator);
  }, noteDuration);

  return {
    pause: () => {
      paused = true;
      stopPlayback(oscillator);
    },
    play: () => {
      paused = false;
    },
    stop: () => {
      if (stopped) return;

      clearInterval(interval);
      stopPlayback(oscillator);
      stopped = true;
    },
    isStopped: () => {
      return stopped;
    },
    isPaused: () => {
      return paused;
    },
    getTime: () => {
      return noteI * noteDuration;
    },
  };
}

gainNode = null;

function setupOscillator() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
  }

  const oscillator = audioContext.createOscillator();

  oscillator.type = "sawtooth";
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.value = 0.1;

  oscillator.start();
  return oscillator;
}

function playNote(note, oscillator) {
  gainNode.gain.value = 0.1;

  if (frequencyMap.hasOwnProperty(note)) {
    oscillator.frequency.setValueAtTime(frequencyMap[note], audioContext.currentTime);
  } else if (note.trim() === "") {
    oscillator.frequency.setValueAtTime(0.1, audioContext.currentTime);
  } else {
    oscillator.stop();
    throw new Error("Invalid note: " + note);
  }
}

function stopPlayback(oscillator, gainNode) {
  oscillator.frequency.setValueAtTime(0, audioContext.currentTime);
}

function calculateDuration(notes, beatsPerMinute) {
  const noteArray = notes.split(",");
  const noteDuration = 60000 / beatsPerMinute;

  return noteArray.length * noteDuration;
}

function durationToString(duration) {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);

  if (minutes === Infinity || seconds === Infinity || isNaN(minutes) || isNaN(seconds)) return "0:00";

  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
