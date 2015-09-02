(function ($) {

  // uncomment the chamber you would like do use
  // note: only you one chamber variable.

  var chamber = 'Federal House';
  //var chamber = 'State Senate';
  //var chamber = 'State House';

  $(main);

  var apiEndpoint = 'https://safe-castle-3553.herokuapp.com/api';

  function main () {
    $('#occupyForm').on('submit', submitForm);
    $('#homeLink').on('click', showForm);
    $('#gpsButton').on('click', getAddress);
    $('#tabCall').on('click', showCall);
    $('#tabEmail').on('click', showEmail);
  }

  function submitForm (e) {
    e.preventDefault();
    var request = $.ajax({
      url: apiEndpoint,
      data: $(e.target).serialize()
    });

    request.done(updateOccupyResults);
    request.fail(function (error) {
      console.log(error);
    });
  }

  function updateOccupyResults(data) {
    if (data.length < 0) return alert('no data');
    data = _.findWhere(data, { chamber: chamber});

    var prefix = data.chamber.indexOf('Senate') < 0 ? 'Representative' : 'Senator';
    var name = prefix + ' ' + data.name;

    var $welcomeRepName = $('#welcomeRepName');
    $welcomeRepName.html(name);

    var $callRepButton = $('#callRepButton');
    var phone = data.districtPhone || data.capitalPhone || '';
    $callRepButton.attr('href', 'tel:' + phone.replace(/[-()\s]/g, ''));
    $callRepButton.html('Call ' + data.name + ' Now!');

    var $emailRepName = $('#emailRepName');
    $emailRepName.html(name);

    var $emailButton = $('#emailButton');
    $emailButton.html('Email ' + name + ' Now!');
    $emailButton.attr('href', 'mailto:' + data.email);

    toggleView();
    showCall();
    $('#gpsButton i')
      .addClass('glyphicon-map-marker')
      .removeClass('glyphicon-refresh');
  }

  function toggleView() {
    $('#occupyMain, #occupyResults, #occupyCall, #occupyEmail').toggleClass('hide');
  }

  function showForm() {
    $('#occupyMain').removeClass('hide');
    $('#occupyResults, #occupyCall, #occupyEmail').addClass('hide');
  }

  function getAddress (e) {
    e.preventDefault();
    $('#gpsButton i')
      .removeClass('glyphicon-map-marker')
      .addClass('glyphicon-refresh');

    var googleEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=:lat,:lng';
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      var url = googleEndpoint
        .replace(':lat', crd.latitude)
        .replace(':lng', crd.longitude);

      $.getJSON(url, function (data) {
        data = data.results[0].formatted_address.split(',');

        $('#inputAddress').val(data[0]);
        $('#inputCity').val(data[1].trim());
        $('#inputZip').val(data[2].split(/\s/g)[2]);

        $('#occupyForm').submit();

      });

    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  function showEmail() {
    $('#occupyEmail').removeClass('hide');
    $('#occupyCall').addClass('hide');
  }

  function showCall() {
    $('#occupyEmail').addClass('hide');
    $('#occupyCall').removeClass('hide');
  }
})(jQuery);
