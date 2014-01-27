define([
    'jquery'
], function () {

    var height = $(document).height() - 20;
    $('#tracklist').animate({height: height - 350});
    $('#cue').animate({height: height - 173});

    $('#cue').one('click', function () {
        $(this).select();
    });

});
