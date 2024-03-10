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
