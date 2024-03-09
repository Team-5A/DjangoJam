const tunes = Array.from(document.querySelectorAll(".tune"));

tunes.forEach((tune) => {
  const tuneId = tune.getAttribute("data-tune-id");

  const deleteTuneButton = document.querySelector(".tune-delete");

  deleteTuneButton.addEventListener("click", async () => {
    try {
      await fetch(`/django_jam_app/delete_tune/${tuneId}`);

      tune.remove();
    } catch (error) {
      alert(`Failed to delete tune: ${error}`);
    }
  });
});
