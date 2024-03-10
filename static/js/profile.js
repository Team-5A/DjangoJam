const deleteAccountButton = document.getElementById("delete-account-button");

if (deleteAccountButton) {
  deleteAccountButton.addEventListener("click", async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    window.location.href = "/django_jam_app/delete_account/";
  });
}
