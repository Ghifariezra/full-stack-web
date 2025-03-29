document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  if (currentPath === "/sign-up" || currentPath === "/sign-in") {
    const errorField = document.querySelector(".error-field");
    const labelPass = document.querySelector("label[for='password']");

    if (errorField && errorField.textContent.trim() !== "") {
      errorField.style.display = "flex";
      labelPass?.scrollIntoView({ behavior: "smooth" });
      console.log("Error ditampilkan!");
    } else {
      console.log("Tidak ada error untuk ditampilkan.");
    }
  }
});
