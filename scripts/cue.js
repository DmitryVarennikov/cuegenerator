define([
    'cue/parser',
    'cue/formatter',
    'jquery',
], function(parser, formatter) {

    function createCue(perfomer, title, filename, tracklist, regionsList) {
        var cue = '';

        perfomer = parser.perfomer(perfomer);
        perfomer = formatter.perfomer(perfomer);

        title = parser.title(title);
        title = formatter.title(title);

        filename = parser.filename(filename);
        filename = formatter.filename(filename);

        tracklist = parser.tracklist(tracklist);
        regionsList = parser.regionsList(regionsList);
        tracklist = formatter.tracklist(tracklist, regionsList);

        cue = perfomer + title + filename + tracklist;

        return cue;
    }

    $('#cue_fields input, #cue_fields textarea').keyup(function(e) {
        var perfomer = $('#perfomer').val();
        var title = $('#title').val();
        var filename = $('#filename').val();
        var tracklist = $('#tracklist').val();
        var regionsList = $('#regions_list').val();

        var cue = createCue(perfomer, title, filename, tracklist, regionsList);
        $('#cue').val(cue);
    });

});