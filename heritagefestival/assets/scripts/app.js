;(function($) {
    $(document).ready(function() {

        var wow = new WOW(
          {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       0,          // distance to the element when triggering the animation (default is 0)
            mobile:       true,       // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
              // the callback is fired every time an animation is started
              // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
          }
        );

        wow.init();


        $.fn.extend({
            animateCss: function (animationName) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                    $(this).removeClass('animated ' + animationName);
                });
            }
        });


        setTimeout(function(){
            $('#prop').removeClass('fadeInRight wow').removeAttr('style');
            $('#prop').animateCss('tada');
        },3000);

        setTimeout(function() {
            var items_count = $('.tagboard-embed').attr('tgb-post-count');
            var new_ig_height = items_count * 415 + 130;
            var new_ig_height_mobile = items_count * 360 + 130;
            var new_ig_height_mobile_larger = items_count * 470 + 130;
            $(window).resize(function() {
                if (window.innerHeight < window.innerWidth) {
                    if ($('body').width() <= 568) {
                        $('#instagram, #instagram .wrap').height(2880);
                    } else if ($('body').width() <= 667) {
                        $('#instagram, #instagram .wrap').height(3380);
                    } else if ($('body').width() <= 1024) {
                        $('#instagram, #instagram .wrap').height(2100);
                    } else {
                        $('#instagram, #instagram .wrap').height(1650);
                    }
                } else if ($('body').width() <= 374) {
                    $('#instagram, #instagram .wrap').height(new_ig_height_mobile);
                } else if ($('body').width() <= 414) {
                    $('#instagram, #instagram .wrap').height(new_ig_height_mobile_larger);
                } else if ($('body').width() <= 480) {
                    $('#instagram, #instagram .wrap').height(new_ig_height);
                } else if ($('body').width() <= 980) {
                    $('#instagram, #instagram .wrap').height(1860);
                } else if ($('body').width() <= 1048) {
                    $('#instagram, #instagram .wrap').height(2100);
                } else if ($('body').width() <= 1304) {
                    $('#instagram, #instagram .wrap').height(1530);
                } else {
                    $('#instagram, #instagram .wrap').height(1650);
                }
            });
            $(window).trigger('resize');
        }, 550);

    });
})(jQuery);
