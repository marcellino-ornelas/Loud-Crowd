$(function() {
  // $("#menu, #topnav").on("click", function() {
  //   $("#topnav").toggle();
  // });

  // var output = document.getElementById("demo") || {};
  // output.innerHTML = slider.value; // Display the default slider value
  var $body = $(document.body);

  /*
   * Navigation Bar
  */

  var $sideNavButton = $(".nav-bars > .fa-bars");
  var $navContent = $(".nav-links");
  var $overlay = $("#overlay");

  var activateSideNav = function(event){
    // toggle side nav when in mobile
    var displayIsOn = $navContent.is(":hidden");

    $navContent.toggleClass("show",displayIsOn);
    $overlay.toggleClass("show",displayIsOn);
    $body.toggleClass("no-flow", displayIsOn);

  }

  $sideNavButton.on("click", activateSideNav );

  $overlay.on("click",function(event){
    // return if side nav isnt open
    if($navContent.is(":hidden")){ return; }

    // toggle side nav
    activateSideNav();

  });

  /*
   * Slider
   *
  */
  var $slider = $("#slider");
  var $sliderValue = $("#sliderValue");
  // var $scoreUpdateBtn = $("#scoreUpdate");
  var $scoreValue = $("#score");
  // var eventId = $scoreUpdateBtn.attr("data-event-id");

  // initialization
  $.fn.slider && $slider.slider({
    max: 20,
    min: 1,
    value: $scoreValue.val()
  });

  $slider.on("slide", function(event,ui){
    var value = ui.value;
    $sliderValue.text("Score: " +value);
    $scoreValue.val(value);
  });

});
