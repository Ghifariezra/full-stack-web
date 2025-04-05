// Variabel untuk menyimpan level permainan dan status game
let level = 0;
let hasStarted = false;

const gamePattern = [];
const userClickedPattern = [];
const buttonColours = ["red", "blue", "green", "yellow"];

// Fungsi untuk memilih warna acak & menambah level
function nextSequence() {
  userClickedPattern.length = 0; // Reset input user setiap level baru
  level++; // Tambah level
  $("#level-title").text(`Level ${level}`); // Update teks h1

  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Efek animasi dan suara
  $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);

  console.log(`Game pattern: ${gamePattern}`);
}

// Fungsi untuk mengecek jawaban user
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    startOver();
  }
}

// Fungsi untuk mereset permainan setelah kalah
function startOver() {
  level = 0;
  gamePattern.length = 0;
  hasStarted = false;
}

// Fungsi memutar suara
function playSound(name) {
  let audio = new Audio(`./sounds/${name}.mp3`);
  audio.play();
}

// Fungsi animasi klik tombol
function animatePress(currentColor) {
  $(`#${currentColor}`).addClass("pressed");
  setTimeout(() => {
    $(`#${currentColor}`).removeClass("pressed");
  }, 100);
}

// Deteksi tombol keyboard pertama untuk memulai permainan
$(document).keypress(function () {
  if (!hasStarted) {
    $("#level-title").text(`Level ${level}`); // Ubah teks h1
    nextSequence();
    hasStarted = true; // Pastikan game hanya dimulai sekali
  }
});

// Event listener saat user klik tombol
$(".btn").click(function () {
  let userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  // Periksa apakah jawaban benar
  checkAnswer(userClickedPattern.length - 1);
});
