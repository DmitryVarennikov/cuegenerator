define([
], function() {

    function formatPerfomer(string) {
        return 'PERFORMER "' + string + '"\n';
    }

    function formatTitle(string) {
        return 'TITLE "' + string + '"\n';
    }

    function formatFilename(string) {
        return 'FILE "' + string + '" MP3\n';
    }

    function formatTracklist(tracklist, regionsList) {
        var output = '';

        for (var i = 0; i < tracklist.length; i++) {
            var row = tracklist[i];

            output += '  TRACK ' + (row.track < 10 ? '0' + row.track : row.track) + ' AUDIO\n';
            output += '    PERFORMER "' + row.perfomer + '"\n';
            output += '    TITLE "' + row.title + '"\n';
            output += '    INDEX 01 ' + (regionsList[i] ? regionsList[i] : row.time) + '\n';
        }

        return output;
    }

    return {
        perfomer: formatPerfomer,
        title: formatTitle,
        filename: formatFilename,
        tracklist: formatTracklist,
    };

});