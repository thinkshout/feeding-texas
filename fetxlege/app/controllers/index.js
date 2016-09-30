import Ember from 'ember';

export default Ember.Controller.extend({


  validate: function() {
    var address = $('input[name="address"]').val();
    var city = $('input[name="city"]').val();
    var zipcode = $('input[name="zipcode"]').val();

    // validate address
    if (address.trim() === '') {
      this.set('addressError', 'Please enter address');
    } else {
      this.set('addressError', '');
    }

    // validate city
    if (city.trim() === '') {
      this.set('cityError', 'Please enter city');
    } else {
      this.set('cityError', '');
    }

    // validate zipcode
    var validZip = function(zipcode) {
      return /^[0-9]{5}(?:-[0-9]{4})?$/.test(zipcode);
    };

    if (zipcode.trim() === '' || !validZip(zipcode)) {
      this.set('zipcodeError', 'Please enter a valid zip code');
    } else {
      this.set('zipcodeError', '');
    }

    // If the entire form validates
    if (address === '' || city === '' || zipcode === '') {
      this.set('formErrors', 'true');
      return { validated: false };
    } else {
      this.set('formErrors', 'false');
      return {
        validated: true,
        address: address,
        city: city,
        zipcode: zipcode
      };
    }
  },

  fetchReps: function(params, locationMethod) {
    console.log(params);
    var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ params["address"] + ',+' + params["city"] + ',+TX' + params["zipcode"] +'&key=AIzaSyBXybAQeTTtPE9fZ6OEaUxIkJMLmXdayBQ';
    console.log(geocodeURL);

    var coordinates = [];
    $.ajax({
      url: geocodeURL,
      async: false,
      dataType: 'json',
      success: function (data) {
        coordinates = data.results[0].geometry.location;
        console.log(coordinates);
      }
    });

    var legeURL = '';
    switch (chamberFlag) {
      case 'state senate':
        legeURL = 'https://openstates.org/api/v1/legislators/geo/?lat=' + coordinates.lat + '&long=' + coordinates.lng + '&apikey=d6a537612a8f4d8398bbccd6b140a45c';
        break;

      case 'state house':
        legeURL = 'https://openstates.org/api/v1/legislators/geo/?lat=' + coordinates.lat + '&long=' + coordinates.lng + '&apikey=d6a537612a8f4d8398bbccd6b140a45c';
        break;

      case 'federal senate':
        legeURL= 'https://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + coordinates.lat + '&longitude=' + coordinates.lng + /*'&zip='+ params['zipcode'] +*/'&apikey=d6a537612a8f4d8398bbccd6b140a45c';
        break;

      case 'federal house':
        legeURL= 'https://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + coordinates.lat + '&longitude=' + coordinates.lng + /*'&zip='+ params['zipcode'] +*/'&apikey=d6a537612a8f4d8398bbccd6b140a45c';
        break;

      default:
        legeURL = 'https://openstates.org/api/v1/legislators/geo/?lat=' + coordinates.lat + '&long=' + coordinates.lng + '&apikey=d6a537612a8f4d8398bbccd6b140a45c';
    }


    $.getJSON(legeURL, function(data) {
      if(typeof(data.results) !== 'undefined' || typeof(data !== 'undefined' )) {
        $('.rep-form-wrapper, .geolocate-wrapper').fadeOut();
        $('.reset-btn').fadeIn();

        var reps = typeof(data.results) == 'undefined' ? data : data.results;

        reps.forEach(function(rep) {
          if (rep) {
            if (chamberFlag == 'federal senate' || chamberFlag == 'federal house') {
              reps = {
                title:        chamberFlag == 'federal house' ? rep.title = 'Representative' : 'Senator',
                chamber:      rep.chamber == 'house' || rep.chamber == 'lower' ? 'house' : 'senate',
                name:         rep.first_name + ' ' + rep.last_name,
                phone:        rep.phone || '',
                email:        rep.oc_email || '',
                contact_form: rep.contact_form || '',
                image:        rep.photo_url || ''
              }
            } else {
              var contactURL = "";
              if (rep.district) {
                if (rep.chamber == 'upper') {
                  contactURL = 'http://www.senate.state.tx.us/75r/senate/members/dist'+ rep.district +'/dist' + rep.district + '.htm#form';
                } else {
                  contactURL = 'http://www.house.state.tx.us/members/member-page/email/?district=' + rep.district;
                }
              }

              reps = {
                title:        chamberFlag == 'state house' ? rep.title = 'Representative' : 'Senator',
                chamber:      rep.chamber == 'lower' || rep.chamber == 'house' ? 'house' : 'senate',
                name:         rep.full_name,
                phone:        rep.offices[0].phone || '',
                email:        rep.offices[0].email || '',
                contact_form: contactURL,
                image:        rep.photo_url || ''
              }
            }

            console.log(reps);

            var snips = {
              image: function() {
                if (reps.image !== '') {
                  return '<img class="rep-image" src="'+ reps.image +'" alt="' + reps.name + '" />';
                } else {
                  return '';
                }
              },
              phone: function() {
                if (reps.phone !== '') {
                  return '<div class="call-rep">' +
                    "<p><strong>Please call your legislator's office at <a href=\"tel\:" + reps.phone + "\">" + reps.phone + "</a> and:</strong></p>" +
                    '<hr>' +
                    '<ul>' +
                      '<li>Give your name and and say that you are constituent.</li>' +
                      '<li>Tell them you support the work of your local food bank to bring more healthy produce to hungry Texans</li>' +
                      '<li>If you have a personal story about hunger or nutrition please share it.</li>' +                      
                      '<li>Thank them for their assistance</li>' +
                    '</ul>' +
                  '</div>';
                }
              },
              emailBtn: function() {
                if (reps.email !== '' || reps.contact_form !== '')  {
                  return '<button class="button primary-btn email-btn">Email ' + reps.name + '</button> ';
                } else {
                  return '';
                }
              },
              emailText: function() {
                if (reps.contact_form !== '') {
                  return '<div class="email-rep">' +
                            '<p><strong>Please <a target="_blank" href="' + reps.contact_form + '">email your legislator\'s office</a> and:</strong></p>' +
                            '<hr>' +
                            '<ul>' +
                              '<li>Give your name and and say that you are constituent.</li>' +
                              '<li>Tell them you support the work of your local food bank to bring more healthy produce to hungry Texans</li>' +
                              '<li>If you have a personal story about hunger or nutrition please share it.</li>' +
                              '<li>Thank them for their assistance</li>' +
                            '</ul>' +
                          '</div>';
                } else {
                  return '<div class="email-rep">' +
                              '<p><strong>Please <a href="mailto:' + reps.email + '">Email your legislator\'s office</a> and:</strong></p>' +
                              '<hr>' +
                              '<ul>' +
                                '<li>Give your name and and say that you are constituent.</li>' +
                              '<li>Tell them you support the work of your local food bank to bring more healthy produce to hungry Texans</li>' +
                              '<li>If you have a personal story about hunger or nutrition please share it.</li>' +                                                     '<li>Thank them for their assistance</li>' +
                              '</ul>' +
                            '</div>';
                }
              }
            }; // end snips

            if (chamberFlag.indexOf(reps.chamber) !== -1) {
              $('.cards-container').append(
                '<div class="rep-card">' +
                  snips.image() +
                  '<h1>'+reps.title+' '+reps.name+'</h1>' +
                  '<button class="button primary-btn call-btn">Call ' + reps.name + '</button> ' +
                  snips.emailBtn() +
                  snips.phone() +
                  snips.emailText() +
                '</div>'
              );
            }
          }
        });

        $('.email-btn').click(function() {
          $(this).parent().find('.email-rep').fadeIn();
          $(this).parent().find('.call-rep').hide();
        });

        $('.call-btn').click(function() {
          $(this).parent().find('.email-rep').hide();
          $(this).parent().find('.call-rep').fadeIn();
        });

      } else {
        if (locationMethod == 'byGeolocation') {
          $('.locate-btn').removeAttr('disabled').find('span').text('Get My Location ');
          $('.no-geo-results').append('<p>No results found for your location. Try using your address.</p>');
        } else {
          $('.no-address-results').append('<p>No results found for your address.<p>');
          $('.address-btn').removeAttr('disabled').find('span').text('Find My Representatives');
        }
      }
    });
  },

  actions: {
    requestReps: function() {
      $('.no-address-results').text('');
      var validated = this.validate();
      if (validated.validated) {
        $('.address-btn').attr('disabled', 'disabled');
        this.set('addressButtonText', 'Finding Your Representatives');
        var params = {
          address: validated.address,
          city: validated.city,
          zipcode: validated.zipcode
        };
        this.fetchReps(params, 'byAddress');
      }
    },

    resetResults: function() {
      $('.loading').fadeOut();
      $('.reset-btn').hide();
      $('input').val('');
      $('.rep-card').remove();
      $('.rep-form-wrapper, .geolocate-wrapper').fadeIn();
      this.set('addressButtonText', 'Finding Your Representatives');
      $('.address-btn').removeAttr('disabled');
      $('.locate-btn').removeAttr('disabled').text('Get My Location');
    },

    geolocate: function() {
      var self = this;
      $('.locate-btn').attr('disabled', 'disabled').find('span').text('Getting your location ');
      $('.loading').fadeIn();
      $('.no-geo-results').text('');

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      function success(pos) {
        var points = pos.coords;
        var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+points.latitude+','+points.longitude+'&key=AIzaSyBXybAQeTTtPE9fZ6OEaUxIkJMLmXdayBQ';
        // var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=30.2849185,-97.7340567&key=AIzaSyBXybAQeTTtPE9fZ6OEaUxIkJMLmXdayBQ';
        console.log(pos);
        $.getJSON(geocodeURL, function(data) {
          var location = data.results[0].formatted_address.split(',');
          var params = {};
          params.address = location[0];
          params.city = location[1].trim();
          params.zipcode = location[2].split(/\s/g)[2];

          self.fetchReps(params, 'byGeolocation');
        });
      }

      function error(err) {
        console.log(err.message);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    },
  }
});
