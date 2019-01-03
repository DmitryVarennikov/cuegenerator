define([
    'cue/parser',
    'cue/formatter',
    'jquery'
], function (parser, formatter) {
    'use strict';

    function createCue(performer, title, filename, fileType, tracklist, regionsList) {
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
        filenameFormatted = formatter.filename(filename, fileType);

        tracklist = parser.tracklist(tracklist);
        regionsList = parser.regionsList(regionsList);
        tracklistFormatted = formatter.tracklist(tracklist, regionsList, performer);

        cue = performerFormatted + titleFormatted + filenameFormatted + tracklistFormatted;

        return cue;
    }

    function onChange() {
        const performer = $('#perfomer').val();
        const title = $('#title').val();
        const filename = $('#filename').val();
        const fileType = $('#filetype').val();
        const tracklist = $('#tracklist').val();
        const regionsList = $('#regions_list').val();

        var cue = createCue(performer, title, filename, fileType, tracklist, regionsList);
        $('#cue').val(cue);
    }

    $('#cue_fields input, #cue_fields textarea').keyup(onChange);
    $('#cue_fields select').change(onChange);

});
