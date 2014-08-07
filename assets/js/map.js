$(document).ready ( function() {

  //loop through all the mapping elements
  $(".mapping").each(function() {

    var map;
    var bounds;

    // initialize the map canvas
    $(this).find('.map-canvas').each(function() {    
      map = initMap(this);
      bounds = new google.maps.LatLngBounds();
    });

    // loop through map points and put them on the map
    var points = $(this).find(".map-point");
    points.each(function() {

      // create a latlong and marker for each point
      var latlng = new google.maps.LatLng($(this).attr('latitude'), $(this).attr('longitude'));    
      var marker = new google.maps.Marker({
        map: map,
        icon: $(this).attr('icon'),
        position: latlng,
        title: $(this).find(".description").text(),
        url: $(this).find(".description a").attr('href')
      });

      // insert static polygon as test
      var zipCoords = [
        new google.maps.LatLng(30.492634,-95.816716),
        new google.maps.LatLng(30.481637,-96.13729),
        new google.maps.LatLng(30.607557,-96.18183),
        new google.maps.LatLng(30.665293,-95.972879),
        new google.maps.LatLng(30.626252,-95.904695),
        new google.maps.LatLng(30.503081,-95.817816),
        new google.maps.LatLng(30.492634,-95.816716)
      ];
      // Construct the polygon.
      var zipOutline = new google.maps.Polygon({
          paths: zipCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
      });
      zipOutline.setMap(map);

      // if the map point has HTML, turn it into an info window
      var infowindow = new google.maps.InfoWindow({
        content: $(this).html()
      });

      // handle clicks to the marker
      google.maps.event.addListener(marker, 'click', function() {
        if (this.url) {
          window.open(this.url);
        } else {
          infowindow.open(map, marker);
        }
      });

      // if there are multiple markers, fit the map to them; otherwise, center the map on the only marker
      if (points.length == 1) {
        map.setCenter(latlng);
      } else {      
        bounds.extend(latlng);
        map.fitBounds(bounds);
      }

    });

  });

});


function initMap(canvas) {

  // set a default zoom unless it's specified
  zoom = parseInt($(canvas).attr('zoom')) || 15;

  // center the map and create options
  var latlng = new google.maps.LatLng(0, 0);
  var myOptions = {
    zoom: zoom,
    center: latlng,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  // create the map
  map = new google.maps.Map(canvas, myOptions);
  map.setCenter(latlng);

  // set some custom styles
  map.set('styles', [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { weight: 0.5 }
      ]
    }, {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        { hue: '#ffff00' }
      ]
    }
  ]);

  return map;

}