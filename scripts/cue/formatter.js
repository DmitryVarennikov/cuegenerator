define([
], function () {
    'use strict';

    function formatPerformer(string) {
        return 'PERFORMER "' + string + '"\n';
    }

    function formatTitle(string) {
        return 'TITLE "' + string + '"\n';
    }

    function formatFilename(name, type) {
        return `FILE "${name}" ${type}\n`;
    }

    function formatTracklist(tracklist, regionsList, globalPerformer) {
        var output = '',
            row,
            performer;

        for (var i = 0; i < tracklist.length; i ++) {
            row = tracklist[i];

            performer = row.performer || globalPerformer;

            output += '  TRACK ' + (row.track < 10 ? '0' + row.track : row.track) + ' AUDIO\n';
            output += '    PERFORMER "' + performer + '"\n';
            output += '    TITLE "' + row.title + '"\n';
            output += '    INDEX 01 ' + (regionsList[i] || row.time) + '\n';
        }

        return output;
    }

    return {
        performer: formatPerformer,
        title:     formatTitle,
        filename:  formatFilename,
        tracklist: formatTracklist
    };

});
