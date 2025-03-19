// Change the color of the h1
// $("h1").css("color", "red");

// Change the color of the h1 using jQuery
$(document).ready(function () {
    $("h1").css("color", "blue");
});

// Select all the buttons
$("button");

// Add Class h1
$("h1").addClass("big-title");

// Remove Class h1
$("h1").removeClass("big-title");

// Check if h1 has class
$("h1").hasClass("big-title");

// Change text
$("h1").text("Bye");
$("button").text("Don't Click Me");

// Update Tag
$("button").html("<em>Bye</em>");

// Get Attribute
console.log($("img").attr("src"));

// Change Value of Attribute
$("a").attr("href", "https://chatgpt.com/");
$("h1").attr("class", "big-title red-title");

// Add Event Listener
$("h1").click(function () {
    $("h1").css("color", "yellow");
    // $("h1").css("border", "2px solid black");
});

$("button").click(function () {
    $("h1").css("color", "yellow");
});

Get Key Press
$("input").keypress(function (event) {
    console.log(event.key);
    // $("h1").text(event.key);
});

// Change text when key is pressed
$(document).keypress(function (event) {
    console.log(event.key);
    $("h1").text(event.key);
});

// Mouse Events - Mouseover
$("h1").on("mouseover", function () {
    $("h1").css("color", "purple");
})

// Add before and after elements to h1
$("h1").before("<button>Before</button>");
$("h1").after("<button>After</button>");

// Prepend and Append elements to h1
$("h1").prepend("<button>Prepend</button>");
$("h1").append("<button>Append</button>");


// Animate Elements with jQuery
$("button").on("click", function () {
    $("h1").hide();
    setTimeout(function () {
        $("h1").show();
        $("h1").text("Thanks for clicking me!");
    }, 200);

    // Hide and Show
    $("h1").toggle();
    
    // Fade In and Out
    $("h1").fadeToggle();
    
    // Slide Up and Down
    $("h1").slideToggle();

    // Animate
    $("h1").animate(
        {opacity: 0.5}
    );

    $("h1").slideToggle().animate(
        {opacity: 0.5}
    );
});
