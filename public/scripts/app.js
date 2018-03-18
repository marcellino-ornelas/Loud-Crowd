$(function() {

  $("#menu, #topnav").on("click", function() {
    $("#topnav").toggle();
  });

  // var slider = document.getElementById("myRange") || {};
  var output = document.getElementById("demo") || {};
  // output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      output.innerHTML = this.value;
  }

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
  $slider.slider({
    max: 20,
    value: $scoreValue.val(),
    min: 1
  });

  $slider.on("slide", function(event,ui){
    var value = ui.value;
    $sliderValue.text("Score: " +value);
    $scoreValue.val(value);
  });

  // $scoreUpdateBtn.on("click", function(event){

  //   var data = {
  //     score: $slider.slider("option", "value")
  //   }
  //   var ratingUrl = "/events/"+eventId+"/rating";

  //   $.post( ratingUrl , data )
  //     .done(function(data){

  //       if(!data.error){
  //         window.location.reload()
  //       }

  //       alert("there was a problem saving your data")

  //     })

  // })

});
