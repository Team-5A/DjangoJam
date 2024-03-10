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

Object.keys(frequencyMap).forEach((note) => {
  if (note.includes("b")) {
    return;
  }

  const i = note.includes("#") ? sharpI++ : normalI++;
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
    const oscillator = setupOscillator();

    // play note
    e.target.classList.add("active");
    dot.classList.add("active");
    playNote(e.target.getAttribute("data-note"), oscillator);

    // stop playing note
    setTimeout(() => {
      e.target.classList.remove("active");
      dot.classList.remove("active");
      stopPlayback(oscillator);
    }, 500);
  });
});

const recordButton = document.getElementById("keyboard-record-button");

recordButton.addEventListener("click", () => {
  recordButton.classList.toggle("active");
});
