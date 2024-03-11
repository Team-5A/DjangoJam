const searchQuery = document.getElementById("search-query");
const urlQuery = new URL(window.location.href).searchParams.get("query");

if (urlQuery) {
  searchQuery.value = urlQuery;
}

const searchCategory = document.getElementById("search-category");
const urlCategory = new URL(window.location.href).searchParams.get("category");

if (urlCategory) {
  searchCategory.value = urlCategory;
}

const top5 = document.getElementById("top-5");
if (document.querySelector(".tune") != null) {
  top5.style.display = "none";
}

const top5Buttons = Array.from(top5.querySelectorAll("button"));

top5Buttons.forEach((button) => {
  const category = button.getAttribute("data-category");

  button.addEventListener("click", async () => {
    const url = new URL(window.location.href);

    url.searchParams.delete("query");
    url.searchParams.delete("category");

    url.searchParams.set("top-5", category);
    console.log(url.searchParams.get("query"));

    window.location.href = url.href;
  });
});
