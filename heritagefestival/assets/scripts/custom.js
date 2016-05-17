;(function($) {
    $(document).ready(function() {
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

        if (getCookie('is_legal') == 'yes') {
            $('.ac_zone').remove();
            $('body').removeClass('age-check');
            $('.age-check-styles').each(function() {
                $(this).remove();
            });
        } else {
            $('html').addClass('ac_active');
            $('.ac_zone').show();
            setTimeout(function() {
                $('#thetext').fadeIn(750);
            }, 350);
        }
        $(window).scrollTop(0);
        if(typeof window.location.hash.substr(1) === "string" && window.location.hash.substr(1) !== '' ){
            callJSON( $('[data-city="'+window.location.hash.substr(1)+'"]').data('id') );
            ChangeUrl('Lone Star Festival', '/festival/'+window.location.hash.substr(1));
        }else{
            ChangeUrl('Lone Star Festival', '/festival');
        }
        $('.go_back').click(function(){
            $('.event_card .info').removeAttr('src');
            $('.section_details, .section_activities').hide();
            $('.section_init, .section_instagram').show();
            $('.list_holder').each(function(){
                $(this).empty();
            });
            $('.preHTML').remove();
            ChangeUrl('Lone Star Festival', '/festival');
        });

        $('.ticket_holder').click(function(){
            $(window).scrollTop(0);
            var caller = $(this).data('id'),
                city = $(this).data('city');
                ChangeUrl('Lone Star Festival', '/festival/' + city);
                callJSON(caller);
                if (window.history && window.history.pushState) {
                    $(window).on('popstate', function() {
                      $('.go_back').trigger('click');
                    });
                }
        });

        function callJSON(caller){
            $.getJSON("/wp-content/themes/brand/view/lonestar/lib/festival/data/data.json", function(data) {
                var items = [],
                    artists = [],
                    vendor = [],
                    activities = [],
                    card_img;
                $.each(data, function(key, val) {
                    if (key === caller) {
                        $.each(val.artists, function(index, value) {
                            artists.push("<li id='" + index + "'>" + value + "</li>");
                        });
                        $.each(val.vendor, function(index, value) {
                            vendor.push("<li id='" + index + "'>" + value + "</li>");
                        });
                        $.each(val.activities, function(index, value) {
                            activities.push("<li id='" + index + "'>" + value + "</li>");
                        });
                        card_img = val.card_img;

                        $( ".event_card a.directlink" ).attr('href',val.event_link);
                        window.console.log(val.pre_html);
                        if(val.pre_html){
                            $('.section_details > div:first-child').prepend(val.pre_html);
                        }
                    }
                });
                $("<ul/>", {
                    "class": "artist-list",
                    html: artists.join("")
                }).appendTo(".artists_details .list_holder");
                $("<ul/>", {
                    "class": "vendor-list",
                    html: vendor.join("")
                }).appendTo(".vendors_details .list_holder");
                $("<ul/>", {
                    "class": "activities-list",
                    html: activities.join("")
                }).appendTo(".activities_details .list_holder");



                $('.event_card .info').removeAttr('src').attr('src',Gui.lib_folder + '/assets/images/' + card_img);

                $('.section_init, .section_instagram').hide();
                $('.section_details, .section_activities').show();
            }).done(function() {
               var heights = $(".list_holder ul").map(function (){
                    return $(this).height();
                }).get(),
                maxHeight = Math.max.apply(null, heights);
                $('.list_holder ul').each(function(){
                   $(this).css('height',maxHeight+'px');
                });
            }); // End JSON Request
        }

    });
})(jQuery);

function ChangeUrl(title, url) {
    if (typeof (history.pushState) != "undefined") {
          var obj = { Title: title, Url: url };
          history.pushState(obj, obj.Title, obj.Url);
    } else {
          // alert("Browser does not support HTML5.");
    }
}
