define([
    'jquery'
], function() {

    var height = $(document).height() - 20;
    $('#cue_fields textarea#tracklist').animate({height: height - 350});
    $('#cue').animate({height: height - 173});

    $('textarea#cue').one('click', function()
    {
        $(this).select();
    });

});