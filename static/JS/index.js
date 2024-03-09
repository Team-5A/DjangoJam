const signUpForm = document.getElementById("signup-form");

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const url = new URL("/django_jam_app/register", window.location.href);

  if (username !== "") {
    url.searchParams.set("username", username);
  }

  window.location.href = url.href;
});
