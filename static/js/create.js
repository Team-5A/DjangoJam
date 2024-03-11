function hexToHSL(H, lightnessMultiplier = 1) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  l *= lightnessMultiplier;

  return "hsl(" + h + "," + s + "%," + l + "%)";
}

const keyboard = document.getElementById("keyboard");
const keysContainer = document.getElementById("keys");
const dotsContainer = document.getElementById("keyboard-dots");
const noteExplosionContainer = document.getElementById("note-explosion-container");

const noteColors = [
  "#33a8c7",
  "#52e3e1",
  "#a0e426",
  "#fdf148",
  "#ffab00",
  "#f77976",
  "#f050ae",
  "#d883ff",
  "#9336fd",
];
const noteColorsHSL = noteColors.map((color) => hexToHSL(color));
const sharpNoteColors = noteColors.map((color) => hexToHSL(color, 0.3));

let normalI = 0;
let sharpI = 0;

let notes = [];
let isRecording = false;

const playBar = document.querySelector(".play-bar");
const tempoInput = document.getElementById("song-tempo");

tempoInput.addEventListener("input", (e) => {
  playBar.setAttribute("data-bpm", e.target.value);
});

playBar.setAttribute("data-bpm", tempoInput.value);

Object.keys(frequencyMap).forEach((note) => {
  if (note.includes("b")) {
    return;
  }

  const i = note.includes("#") ? sharpI++ : normalI++;
  const normalISaved = normalI;

  const color = note.includes("#")
    ? sharpNoteColors[normalI % sharpNoteColors.length]
    : noteColorsHSL[normalI % noteColorsHSL.length];

  // create key
  const key = document.createElement("button");
  key.classList.add("key");
  key.setAttribute("data-note", note);
  key.style.setProperty("--key-active-color", `${color}`);

  if (note.includes("#")) {
    key.classList.add("key-sharp");

    const normalKey = document.querySelector(`.key[data-note='${note.replace("#", "")}']`);
    normalKey.appendChild(key);
    return;
  }

  keysContainer.appendChild(key);

  // create dot
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.setAttribute("data-note", note);
  dot.style.setProperty("--dot-active-color", color);

  dotsContainer.appendChild(dot);

  // interactions
  key.addEventListener("click", (e) => {
    if (e.target.getAttribute("data-playing") === "true") {
      return;
    }

    const oscillator = setupOscillator();

    // play note
    e.target.classList.add("active");
    e.target.setAttribute("data-playing", "true");
    dot.classList.add("active");
    playNote(e.target.getAttribute("data-note"), oscillator);

    if (isRecording) {
      notes.push(e.target.getAttribute("data-note"));

      if (notes.join(",").length > 64) {
        notes.pop();
        isRecording = false;
        recordButton.classList.remove("active");
      }

      playBar.setAttribute("data-notes", notes.join(","));
    }

    // create note explosion
    const noteExplosion = document.createElement("div");
    noteExplosion.classList.add("note-explosion");
    noteExplosion.style.setProperty("--note-explosion-color", color);

    const x = (normalISaved / normalI) * keyboard.clientWidth;
    const y = noteExplosionContainer.clientHeight * 0.5;

    noteExplosion.style.left = `${x}px`;
    noteExplosion.style.top = `${y}px`;

    noteExplosion.addEventListener("animationend", () => {
      noteExplosion.remove();
    });

    noteExplosionContainer.appendChild(noteExplosion);

    // stop playing note
    setTimeout(() => {
      e.target.classList.remove("active");
      e.target.setAttribute("data-playing", "false");
      dot.classList.remove("active");
      stopPlayback(oscillator);
    }, 400);
  });
});

const recordButton = document.getElementById("keyboard-record-button");

recordButton.addEventListener("click", () => {
  isRecording = !isRecording;
  recordButton.classList.toggle("active");

  if (isRecording) {
    notes = [];
  }
});

const createForm = document.getElementById("create-form");

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const songName = document.getElementById("song-name").value;
  const bpm = tempoInput.value;
  const visibility = document.querySelector('input[name="visibility"]:checked').value;

  if (notes.length === 0) {
    alert("Please record some notes first!");
    return;
  }

  if (songName.length === 0) {
    alert("Please enter a song name!");
    return;
  }

  if (bpm <= 0) {
    alert("Please enter a bpm greater than 0!");
    return;
  }

  const csrf = document.getElementsByName("csrfmiddlewaretoken")[0].value;

  try {
    const res = await fetch("/django_jam_app/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      body: JSON.stringify({ name: songName, notes: notes.join(","), bpm: Number(bpm), visibility }),
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 400) {
      throw new Error(data.error);
    }

    window.location.href = `/django_jam_app/profile/${data.user_slug}/`;
  } catch (error) {
    alert(error);
  }
});

const restButton = document.getElementById("rest-button");

restButton.addEventListener("click", () => {
  if (isRecording) {
    notes.push("");

    if (notes.join(",").length > 64) {
      notes.pop();
      isRecording = false;
      recordButton.classList.remove("active");
    }

    playBar.setAttribute("data-notes", notes.join(","));
  }
});
