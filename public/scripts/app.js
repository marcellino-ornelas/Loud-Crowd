$(function() {

  var $body = $(document.body);
  // $body.css("background-color", `rgb(${red}, 0, ${blue})`);

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
  var $scoreValue = $("#score");
  var $average = $("#average");
  // var $rate = $("#rate");

  // $rate.on("submit", function(e){
  //   e.preventDefault();
  //   $this = $(this);
  //   // this.submit();

  // })

  // initialization
  $.fn.slider && $slider.slider({
    max: 255,
    min: 1,
    value: $scoreValue.val()
  });

  // $slider.on("slide", function(event, ui){
  //   var value = ui.value;
  //   $scoreValue.val(value);
  // });

  $slider.on("slidestop", function(event){
    $.ajax({
      url: formUrl,
      method: method,
      data: { score: $slider.slider("option","value") },
      success: function(data){
        if(method === "POST" && data.rating){
          method = "PUT";
          formUrl += "/"+data.rating._id;
        }
      },
      error: console.log
    })
  });

  /*
   * Socket.io
  */

  if( $slider.length > 0){
    var socket = io.connect('https://crowd-engagement.herokuapp.com');

    socket.on('connection', function() {
      console.log("connection established");
    });

    socket.on("average", updateAverage );
  }

  function updateAverage(data){
    $average.text("Average Score: " + (data * 10 / 255).toFixed(2) + " out of 10");

    var red = data;
    var blue = 255 - data;

    $("body").css("background-color", `rgb(${red}, 0, ${blue})`)
  }

});
