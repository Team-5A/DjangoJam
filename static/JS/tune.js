const tunes = Array.from(document.querySelectorAll(".tune"));

tunes.forEach((tune) => {
  const tuneId = tune.getAttribute("data-tune-id");
  const loggedInUserId = tune.getAttribute("data-logged-in-user-id");

  const deleteTuneButton = tune.querySelector(".tune-delete");

  if (deleteTuneButton) {
    deleteTuneButton.addEventListener("click", async () => {
      try {
        await fetch(`/django_jam_app/delete_tune/${tuneId}`);

        tune.remove();
      } catch (error) {
        alert(`Failed to delete tune: ${error}`);
      }
    });
  }

  const likeButton = tune.querySelector(".tune-like");
  const likeImage = tune.querySelector(".like-image");
  const unlikeImage = tune.querySelector(".unlike-image");
  const likesCount = tune.querySelector(".tune-likes-count");

  const updateLikeButton = () => {
    if (likeButton.classList.contains("liked")) {
      likeImage.style.display = "none";
      unlikeImage.style.display = "block";
    } else {
      likeImage.style.display = "block";
      unlikeImage.style.display = "none";
    }
  };
  updateLikeButton();

  likeButton.addEventListener("click", async () => {
    try {
      //   await fetch(`/django_jam_app/like_tune/${tuneId}`);

      likeButton.classList.toggle("liked");

      // update likes count
      const currentLikes = parseInt(likesCount.textContent);
      likesCount.textContent = Math.max(0, currentLikes + (likeButton.classList.contains("liked") ? 1 : -1));

      updateLikeButton();

      localStorage.setItem(`tune-${tuneId}-liked-${loggedInUserId}`, likeButton.classList.contains("liked"));
    } catch (error) {
      alert(`Failed to like tune: ${error}`);
    }
  });

  // pre like tune
  const currentLikes = parseInt(likesCount.textContent);
  if (localStorage.getItem(`tune-${tuneId}-liked-${loggedInUserId}`) === "true" && currentLikes > 0) {
    likeButton.classList.add("liked");
    updateLikeButton();
  } else {
    localStorage.removeItem(`tune-${tuneId}-liked-${loggedInUserId}`);
  }
});
