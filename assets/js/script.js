  //night mode functionality
  $("#night-mode").on("click", function() {
    if ($("main").css("background-color") === "rgb(0, 0, 0)") {
      $("main").css({"background-color": "white"});
      $("#night-mode").html("dark mode");
    } else {
      $("main").css({"background-color": "black"});
      $("#night-mode").html("light mode");
    }
  });