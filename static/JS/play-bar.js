const playBars = Array.from(document.querySelectorAll(".play-bar"));

playBars.forEach((playBar) => {
  const playIcon = playBar.querySelector("#play-icon");
  const pauseIcon = playBar.querySelector("#pause-icon");
  const togglePlayButton = playBar.querySelector("#toggle-play-button");

  togglePlayButton.addEventListener("click", () => {
    if (playIcon.style.display === "none") {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }
  });

  const bar = playBar.querySelector(".progress-bar");
  const barTrack = playBar.querySelector(".progress-bar-track");
  let isDragging = false;

  const updateBar = (event) => {
    const barWidth = bar.clientWidth;
    const clickX = event.pageX - bar.offsetLeft;

    const percent = Math.max(0, Math.min((clickX / barWidth) * 100, 100));
    barTrack.style.width = `${percent}%`;
  };

  bar.addEventListener("mousedown", () => {
    isDragging = true;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (event) => {
    if (isDragging) {
      updateBar(event);
    }
  });

  bar.addEventListener("click", (event) => {
    updateBar(event);
  });
});
