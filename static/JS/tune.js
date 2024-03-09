const tunes = Array.from(document.querySelectorAll(".tune"));

tunes.forEach((tune) => {
  const tuneId = tune.getAttribute("data-tune-id");

  const deleteTuneButton = tune.querySelector(".tune-delete");

  deleteTuneButton.addEventListener("click", async () => {
    try {
      await fetch(`/django_jam_app/delete_tune/${tuneId}`);

      tune.remove();
    } catch (error) {
      alert(`Failed to delete tune: ${error}`);
    }
  });

  const likeButton = document.querySelector(".tune-like");
  const likeImage = document.querySelector(".like-image");
  const unlikeImage = document.querySelector(".unlike-image");

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
      updateLikeButton();
    } catch (error) {
      alert(`Failed to like tune: ${error}`);
    }
  });
});
