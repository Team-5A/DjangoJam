const deleteAccountButton = document.getElementById("delete-account-button");

if (deleteAccountButton) {
  deleteAccountButton.addEventListener("click", async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    window.location.href = "/django_jam_app/delete_account/";
  });
}

const profilePictureImg = document.querySelector(".profile-picture img");
const profilePictureInput = document.getElementById("upload-picture");
const csrfToken = document.querySelector("input[name=csrfmiddlewaretoken]").value;

profilePictureInput.addEventListener("input", async (e) => {
  const data = new FormData();
  data.append("profile_picture", profilePictureInput.files[0]);

  try {
    const res = await fetch("/django_jam_app/upload_profile_picture/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: data,
    });

    const json = await res.json();
    if (json.error) throw new Error(json.error);

    profilePictureImg.src = json.picture_url;
  } catch (error) {
    alert(error);
  }
});
