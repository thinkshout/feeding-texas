$(document).ready(function(){
	$('.flexslider').flexslider({
 	  animation: "slide",
    animationLoop: false,
    controlNav: false,
    directionNav: true,
    reverse: true,
    prevText: "",
    nextText: "",
    // slideshow: false,
    touch: false,
    // itemWidth: 300,
    // itemMargin: 20,
    // minItems: 1,
    // maxItems: 2
  });

  // Filter products based on Product Type selection
  $('#product-type').change(function(){
    var type = $(this).val();
    $('.product').hide();
    if(type != "all"){
      $('.product[data-type="'+type+'"]').show();
    }
    else {
      $('.product').show();
    }
  });

  // Filter products based on Topic selection
  $('#topic').change(function(){
    var topic = $(this).val();
    console.log(topic);
    $('.product').hide();
    if(topic != "all"){
      $('.product[data-type]:contains(topic)').show();
    }
    else {
      $('.product').show();
    }
  });

  $('#topic').change(function(){
    var topic = $(this).val();
    console.log(topic);

    var classList = $('.product').attr('data-topic').split(/\s+/);
    $.each( classList, function(index, item){
      if (item === topic) {
        $('.product').hide();
      }
    });

    $('.product').hide();
    if(topic != "all"){
      $('.product[data-type]:contains(topic)').show();
    }
    else {
      $('.product').show();
    }
  });

	// Enable the chosen plugin on .chosen-select
  $(".chosen-select").chosen({width: "80%"}).change(
    function(){
      if (this.selectedIndex!==0) {
        window.location.href = this.value;
      }  
    }
  );
});