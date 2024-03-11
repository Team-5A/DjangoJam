const playBars = Array.from(document.querySelectorAll(".play-bar"));

playBars.forEach((playBar) => {
  let notes = playBar.getAttribute("data-notes");
  let bpm = Number(playBar.getAttribute("data-bpm"));
  let duration = calculateDuration(notes, bpm);

  const currentTime = playBar.querySelector(".current-time");
  const totalTime = playBar.querySelector(".total-time");

  totalTime.textContent = durationToString(duration);

  const update = () => {
    notes = playBar.getAttribute("data-notes");
    bpm = Number(playBar.getAttribute("data-bpm"));
    duration = calculateDuration(notes, bpm);

    totalTime.textContent = durationToString(duration);
  };

  const playIcon = playBar.querySelector(".play-icon");
  const pauseIcon = playBar.querySelector(".pause-icon");
  const togglePlayButton = playBar.querySelector(".toggle-play");

  let controls = null;

  const bar = playBar.querySelector(".progress-bar");
  const barTrack = playBar.querySelector(".progress-bar-track");
  let isDragging = false;

  const updatePlaying = () => {
    if (!controls) return;

    update();

    currentTime.textContent = durationToString(controls.getTime());
    barTrack.style.width = `${(controls.getTime() / duration) * 100}%`;

    if (controls.isStopped() || controls.isPaused()) {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }

    if (controls.isStopped()) {
      controls = null;
      barTrack.style.width = "0%";
      currentTime.textContent = "0:00";
    }
  };

  setInterval(updatePlaying, 500);

  togglePlayButton.addEventListener("click", () => {
    update();

    if (notes.length === 0) return;

    if (playIcon.style.display === "none") {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";

      controls.pause();

      updatePlaying();
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";

      if (controls) {
        controls.play();
      } else {
        controls = playSong(notes, bpm);
      }

      updatePlaying();
    }
  });

  const updateBar = (event) => {
    const barWidth = bar.clientWidth;
    const clickX = event.pageX - bar.offsetLeft;

    const percent = Math.max(0, Math.min((clickX / barWidth) * 100, 100));
    barTrack.style.width = `${percent}%`;
  };

  // bar.addEventListener("mousedown", () => {
  //   isDragging = true;
  // });

  // window.addEventListener("mouseup", () => {
  //   isDragging = false;
  // });

  // window.addEventListener("mousemove", (event) => {
  //   if (isDragging) {
  //     updateBar(event);
  //   }
  // });

  // bar.addEventListener("click", (event) => {
  //   updateBar(event);
  // });
});
