// Get the first child of the document
document.firstElementChild;

// Get the first child of the body
document.firstElementChild.firstElementChild;

// Get the last child of the body
document.firstElementChild.lastElementChild;

// Get the first child of the first child of the body
document.firstElementChild.lastElementChild.firstElementChild;

// Get the last child of the first child of the body and change the text
var heading = document.firstElementChild.lastElementChild.firstElementChild;
heading.innerHTML = "Goodbye World!";

// Click the input
document.querySelector("input").click();

// Get all the list items in the unordered list
document.getElementsByTagName("li");

// Change the color of the second list item to gray using an index
document.getElementsByTagName("li")[1].style.color = "gray";

// Get the number of list items
document.getElementsByTagName("li").length;

// Get all the buttons
document.getElementsByClassName("btn");

// Get the first button
document.getElementById("myButton").click();

// Get the first list item
document.querySelector(".list");

// Change the color of the first list item
document.querySelector(".list a").style.color = "orange";

// Change the background color of the button
document.querySelector("button").style.backgroundColor = "pink";

// Add a class to the button
document.querySelector("button").classList.add("invisible");

// Remove a class from the button
document.querySelector("button").classList.remove("invisible");

// Toggle a class on the button
document.querySelector("button").classList.toggle("invisible");

// Get the text of the h1
document.querySelector("h1").textContent;

// Get the attributes of the first link
document.querySelector("a").attributes;

// Get the href value of the first link
document.querySelector("a").getAttribute("href");

// Change the href value of the first link
document.querySelector("a").setAttribute("href", "https://chatgpt.com/");