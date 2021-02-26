define([
    'jquery'
], function () {

    // stretching text areas
    var height = $(document).height() - 20;
    $('#tracklist').animate({height: height - 375});
    $('#cue').animate({height: height - 173});

    $('#cue').one('click', function () {
        $(this).select();
    });

});
