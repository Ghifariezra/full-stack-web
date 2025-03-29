document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/post-blog") {
    const dropArea = document.getElementById("drop-area");
    const inputFile = document.getElementById("input-file");

    if (dropArea && inputFile) {
      dropArea.addEventListener("click", () => inputFile.click());

      dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("dragover");
      });

      dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragover");
      });

      dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("dragover");

        const file = event.dataTransfer.files[0];

        if (file && file.size <= 2 * 1024 * 1024) {
          // Max 2MB
          inputFile.files = event.dataTransfer.files;
          console.log("File uploaded:", file.name);
        } else {
          alert("File size must be less than 2MB");
        }
      });
    }
  }
});
