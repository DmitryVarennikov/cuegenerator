define([
    'cue/parser',
    'cue/formatter',
    'jquery'
], function (parser, formatter) {
    'use strict';

    function createCue(performer, title, filename, tracklist, regionsList) {
        var cue,
            performerFormatted,
            titleFormatted,
            filenameFormatted,
            tracklistFormatted;

        performer = parser.performer(performer);
        performerFormatted = formatter.performer(performer);

        title = parser.title(title);
        titleFormatted = formatter.title(title);

        filename = parser.filename(filename);
        filenameFormatted = formatter.filename(filename);

        tracklist = parser.tracklist(tracklist);
        regionsList = parser.regionsList(regionsList);
        tracklistFormatted = formatter.tracklist(tracklist, regionsList, performer);

        cue = performerFormatted + titleFormatted + filenameFormatted + tracklistFormatted;

        return cue;
    }

    $('#cue_fields input, #cue_fields textarea').keyup(function (e) {
        var performer = $('#perfomer').val();
        var title = $('#title').val();
        var filename = $('#filename').val();
        var tracklist = $('#tracklist').val();
        var regionsList = $('#regions_list').val();

        var cue = createCue(performer, title, filename, tracklist, regionsList);
        $('#cue').val(cue);
    });

});
