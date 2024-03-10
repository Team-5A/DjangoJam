const likeButtons = Array.from(document.querySelectorAll(".like-btn"));

likeButtons.forEach((likeButton) => {
  const tuneId = likeButton.getAttribute("data-tune-id");

  likeButton.addEventListener("click", async () => {
    likeButton.classList.toggle("liked");
    const isLike = likeButton.classList.contains("liked");

    try {
      const likes = document.getElementById(`like-count-${tuneId}`);

      if (isLike) {
        await fetch(`/django_jam_app/like_tune/${tuneId}`);
        likes.textContent = parseInt(likes.textContent) + 1;
      } else {
        await fetch(`/django_jam_app/unlike_tune/${tuneId}`);
        likes.textContent = parseInt(likes.textContent) - 1;
      }
    } catch (error) {
      alert(`Failed to like tune: ${error}`);
    }
  });
});
