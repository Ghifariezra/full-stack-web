document.addEventListener("DOMContentLoaded", function () {
  const inputText = document.querySelector("section#nav .menu-bar form .search .search-input");
  const searchIcon = document.querySelector("section#nav .menu-bar form .search .search-icon");

  inputText.addEventListener("input", function () {
    const text = inputText.value;
    console.log(text);
    searchIcon.classList.toggle("hide", text.length > 0);
  });
});
