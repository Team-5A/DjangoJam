const showPasswordButton = document.getElementById("show-password-button");

showPasswordButton.addEventListener("click", () => {
  const inputName = showPasswordButton.getAttribute("for");
  const input = document.querySelector(`input[name="${inputName}"]`);

  if (input.type === "password") {
    input.type = "text";
    showPasswordButton.textContent = "hide password";
  } else {
    input.type = "password";
    showPasswordButton.textContent = "show password";
  }
});
