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

  /*****
   * Toggle Search
  ******/
  $('#search-toggle').bind('click', function() {
    $('#utility').toggleClass('active');
  });

 /******
   * Filter products based on Product Type and Topic Type selection
   ******/

  // Define elements (No fishing in the DOM more than necessary)
  var productType = $('#product-type'),
      topic       = $('#topic'),
      products    = $('.product');

  // Listen for change on product-type and topic selects
  productType.add(topic).change(function(){

    // Let's fish for this one since we are setting
    // the value on the change event
    var type  = $('#product-type').val();
    var topic = $('#topic').val();

    // If type and topic are all
    if (type === "all" && topic === "all") {

      // Show all products
      products.fadeIn();
    } else {

      //If not all types and topics loop over the products array
      for (var i=0; i<products.length; i++) {

        // If type and topic match an item
        if ($(products[i]).data("topic").indexOf(topic) !== -1 && $(products[i]).data("type").indexOf(type) !== -1) {
          $(products[i]).fadeIn();

          // If only topic matches an item
        } else if ( type === "all" && $(products[i]).data("topic").indexOf(topic) !== -1) {
          $(products[i]).fadeIn();

          // If only type matches an item
        } else if ($(products[i]).data("type").indexOf(type) !== -1 && topic === "all") {
          $(products[i]).fadeIn();

          // Hide items we don't need
        } else  {
          $(products[i]).fadeOut();
        }
      }
    }
  });

  $.getJSON( "assets/json/zip-codes.json", function( data ) {
    var options = $("#options");
    $.each( data, function( key, value ) {
      options.append('<option value="'+value+'">'+value+'</option>');
    });

    // Enable the chosen plugin on .chosen-select
    $(".chosen-select").chosen({width: "80%"}).change(
    function(){
      if (this.selectedIndex!==0) {
        window.location.href = 'zip/' + this.value;
      }
    });
  });

	/******
		* Populate newsletter sign up with email
		******/
		var newsletterEmail = window.location.search.replace('?email=', '').replace('%40', '@');
		$('#mce-EMAIL').attr('value', newsletterEmail);
});
