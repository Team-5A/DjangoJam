const mobileMenuOpen = document.getElementById("mobile-menu-open");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const mobileMenuLinks = document.getElementById("mobile-menu-links");

mobileMenuOpen.addEventListener("click", () => {
  mobileMenuLinks.classList.remove("closed");
});

mobileMenuClose.addEventListener("click", () => {
  mobileMenuLinks.classList.add("closed");
});
