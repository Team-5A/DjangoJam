const keyboard = document.getElementById("keyboard");
const keysContainer = document.getElementById("keys");

Object.keys(frequencyMap).forEach((note) => {
  if (note.includes("b")) {
    return;
  }

  const key = document.createElement("button");
  key.classList.add("key");
  key.setAttribute("data-note", note);

  if (note.includes("#")) {
    key.classList.add("key-sharp");

    const normalKey = document.querySelector(`.key[data-note='${note.replace("#", "")}']`);
    normalKey.appendChild(key);
    return;
  }

  keysContainer.appendChild(key);

  key.addEventListener("click", (e) => {
    const oscillator = setupOscillator();

    // play note
    e.target.classList.add("active");
    playNote(e.target.getAttribute("data-note"), oscillator);

    // stop playing note
    setTimeout(() => {
      e.target.classList.remove("active");
      stopPlayback(oscillator);
    }, 500);
  });
});
