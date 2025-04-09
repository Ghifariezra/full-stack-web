document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.querySelector("section#notes .edit button");

  if (editButton) {
    editButton.addEventListener("click", function () {
      const form = document.querySelector("section#notes .list-notes form.form-notes");
      const checkBoxes = form.querySelectorAll(".check-box");
      const listItems = form.querySelectorAll("ol");
      const addNotes = form.querySelector(".add-notes");
      const choiceButtons = form.querySelector(".choice");
      const newNote = form.querySelectorAll(".edit-note");
      const oldNote = form.querySelectorAll(".note");

      const isVisible = checkBoxes[0].style.display === "block";

      if (isVisible) {
        form.style.gridTemplateColumns = ""; // reset
        checkBoxes.forEach((box) => {
          box.style.display = "none";
        });
        listItems.forEach((item) => {
          item.style.listStyle = "inside";
        });
        addNotes.style.display = "none";
        choiceButtons.style.display = "none";
      } else {
        form.style.gridTemplateColumns = "auto 1fr";
        checkBoxes.forEach((box) => {
          box.style.display = "block";
          box.addEventListener("click", function (e) {
            const value = e.target.value;
            console.log(value);
            const checked = e.target.checked;
            if (checked) {
              console.log(checked);
              oldNote[value - 1].style.display = "none";
              newNote[value - 1].style.display = "block";
            } else {
              oldNote[value - 1].style.display = "block";
              newNote[value - 1].style.display = "none";
            }
          });
        });
        listItems.forEach((item) => {
          item.style.listStyle = "none";
        });
        addNotes.style.display = "block";
        addNotes.style.gridColumn = "-3 / -1";
        choiceButtons.style.display = "flex";
        choiceButtons.style.gridColumn = "-3 / -1";
      }
    });
  }
});
