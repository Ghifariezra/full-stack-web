// Assets Object => Constructor
function LoadAssets(assets) {
    this.images = assets[0]; // Store the list of image filenames
    this.sounds = assets[1]; // Store the list of sound filenames
    this.keys = assets[2]; // Store the corresponding keyboard keys
}

// Function to handle button click and play the corresponding sound
function handleClick(indexName, thisButton) {
    var audio = new Audio(`./sounds/${assets.sounds[indexName]}.mp3`); // Load the audio file
    thisButton.style.color = "yellow"; // Change button text color when clicked
    audio.play(); // Play the sound
    buttonAnimation(thisButton.innerHTML); // Trigger button animation
    console.log("Button clicked:", thisButton.innerHTML);
}

// Function to handle keypress events
function handleKeys(key) {
    let keyIndex = assets.keys.indexOf(key); // Find the index of the pressed key
    console.log("Key index:", keyIndex);
    
    if (keyIndex !== -1) {
        let audio = new Audio(`./sounds/${assets.sounds[keyIndex]}.mp3`); // Load the corresponding sound
        audio.play(); // Play the sound
        console.log("Key pressed:", key);
        buttonAnimation(key); // Trigger button animation
    }
}

// Function to animate the button when clicked or key is pressed
function buttonAnimation(currentKey) {
    var activeButton = document.querySelector("." + currentKey);
    
    if (activeButton) { // Ensure the button exists before applying animation
        activeButton.style.color = "orange";
        activeButton.classList.add("pressed");
        
        setTimeout(function () {
            activeButton.style.color = "#da0463"; // Restore original text color
            activeButton.classList.remove("pressed"); // Remove animation effect
        }, 200);
    }
}

// Create an instance of LoadAssets containing assets data
var assets = new LoadAssets([
    ["crash", "kick", "snare", "tom1", "tom2", "tom3", "tom4"], // Image filenames
    ["crash", "kick-bass", "snare", "tom-1", "tom-2", "tom-3", "tom-4"], // Sound filenames
    ["w", "a", "s", "d", "j", "k", "l"] // Associated keyboard keys
]);

// Select all buttons with the class "drum"
var buttonDrum = document.querySelectorAll(".drum");

// Add event listeners and set background images for each button
buttonDrum.forEach((button, index) => {
    button.style.backgroundImage = `url(./images/${assets.images[index]}.png)`; // Set button background image
    button.addEventListener("click", function () {
        handleClick(index, this); // Pass index and clicked button to handleClick function
    });
});

// Add event listener for keyboard key presses
// Calls handleKeys function when a key is pressed
document.addEventListener("keypress", function(event) {
    handleKeys(event.key);
});
