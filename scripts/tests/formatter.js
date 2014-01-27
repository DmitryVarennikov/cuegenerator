define([
    'cue/formatter'
], function (formatter) {
    'use strict';

    return {
        formatPerformer: function (test) {
            var actual = formatter.performer('Bobina');
            var expected = 'PERFORMER "Bobina"\n';

            test.equal(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);
            test.done();
        },
        formatTitle:     function (test) {
            var actual = formatter.title('Russia Goes Clubbing');
            var expected = 'TITLE "Russia Goes Clubbing"\n';

            test.equal(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);
            test.done();
        },
        formatFilename:  function (test) {
            var actual = formatter.filename('Bobina - Russia Goes Clubbing #272.cue');
            var expected = 'FILE "Bobina - Russia Goes Clubbing #272.cue" MP3\n';

            test.equal(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);
            test.done();
        },
        formatTracklist: function (test) {
            var tracklist = [
                    {track: 1, performer: '', title: 'Miami Echoes', time: '02:41:00'}
                ],
                regionsList = [],
                globalPerformer = 'Bobina';

            var actual = formatter.tracklist(tracklist, regionsList, globalPerformer);
            var expected = '';
            expected += '  TRACK 01 AUDIO\n';
            expected += '    PERFORMER "Bobina"\n';
            expected += '    TITLE "Miami Echoes"\n';
            expected += '    INDEX 01 02:41:00\n';

            test.equal(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);
            test.done();
        }
    };
});
