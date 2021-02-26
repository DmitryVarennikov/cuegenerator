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
        let output = '';
        for (var i = 0; i < tracklist.length; i ++) {
            const row = tracklist[i];
            const performer = row.performer || globalPerformer;
            const time = regionsList[i] || row.time;

            output += '  TRACK ' + (row.track < 10 ? '0' + row.track : row.track) + ' AUDIO\n';
            output += '    PERFORMER "' + performer + '"\n';
            output += '    TITLE "' + row.title + '"\n';
            // when first track does not start at 00:00:00
            // "INDEX 00 00:00:00" line has to be the first index
            if (i === 0 && time !== '00:00:00') {
                output += '    INDEX 00 00:00:00 \n';
            }
            output += '    INDEX 01 ' + time + '\n';
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
