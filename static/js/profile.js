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

const compressImage = async (file) => {
  // const fileReader = new FileReader();
  // fileReader.readAsDataURL(file);

  // await new Promise((resolve) => {
  //   fileReader.onload = (e) => {
  //     resolve();
  //   };
  // });

  // const buffer = await file.arrayBuffer();
  // const blob = new Blob(new Uint8Array(buffer));
  const image = await createImageBitmap(file);

  const offscreenCanvas = new OffscreenCanvas(500, 500);
  const ctx = offscreenCanvas.getContext("2d");

  ctx.drawImage(image, 0, 0, 500, 500);

  const canvasBlob = await offscreenCanvas.convertToBlob({
    quality: 0.5,
    type: "image/jpeg",
  });

  return canvasBlob;
};

profilePictureInput.addEventListener("input", async (e) => {
  if (
    profilePictureInput.files[0].type !== "image/jpeg" &&
    profilePictureInput.files[0].type !== "image/png"
  ) {
    alert("Error: Profile picture must be a png or jpeg.");
    return;
  }

  const compressed = await compressImage(profilePictureInput.files[0]);

  const data = new FormData();
  data.append("profile_picture", compressed, profilePictureInput.files[0].name);

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

    console.log(json.picture_url);
    profilePictureImg.src = json.picture_url;
  } catch (error) {
    alert(error);
  }
});
