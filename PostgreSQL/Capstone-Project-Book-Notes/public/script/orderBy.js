document.addEventListener("DOMContentLoaded", function () {
    const query = window.location.search;
    const currentPath = window.location.pathname;

    const heroContent = document.querySelector("section#hero-content");

    if ((query && query !== "") || currentPath === "/books" || currentPath === "/search") {
        if (heroContent) {
            heroContent.style.display = "none";
        }
    }
});
