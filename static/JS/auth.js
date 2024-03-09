const showPasswordButtons = Array.from(document.querySelectorAll(".show-password-button"));

showPasswordButtons.forEach((showPasswordButton) => {
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
});

// prefill username if provided in query string
const usernameInput = document.querySelector("input[name='username']");
if (usernameInput) {
  const urlParams = new URLSearchParams(window.location.search);

  const username = urlParams.get("username");
  if (username) {
    usernameInput.value = username;
  }
}
