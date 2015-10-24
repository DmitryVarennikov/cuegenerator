define([
    'cue/parser'
], function (parser) {
    'use strict';

    var tests = {
        'title':                        function (test) {
            var value = ' Russia Goes Clubbing 249 (2013-07-17) (Live @ Zouk, Singapore) ';
            var actual = parser.title(value);
            var expected = 'Russia Goes Clubbing 249 (2013-07-17) (Live @ Zouk, Singapore)';
            test.strictEqual(actual, expected);

            test.done();
        },
        'performer':                    function (test) {
            var value = ' Bobina ';
            var actual = parser.performer(value);
            var expected = 'Bobina';
            test.strictEqual(actual, expected);

            test.done();
        },
        'filename':                     function (test) {
            var value = ' Bobina - Russia Goes Clubbing #249 [Live @ Zouk, Singapore].mp3 ';
            var actual = parser.filename(value);
            var expected = 'Bobina - Russia Goes Clubbing #249 [Live @ Zouk, Singapore].mp3';
            test.strictEqual(actual, expected);

            test.done();
        },
        'tracklist1':                   function (test) {
            var value = '\
02:41 Bobina - Miami "Echoes"';
            var actual = parser.tracklist(value);
            var expected = {
                0: {
                    performer: "Bobina",
                    time:      "02:41:00",
                    title:     "Miami Echoes",
                    track:     1
                }
            };
            test.deepEqual(actual, expected);

            test.done();
        },
        'tracklist2':                   function (test) {
            var value = '\
02:41 Miami "Echoes"';
            var actual = parser.tracklist(value);
            var expected = {
                0: {
                    performer: "",
                    time:      "02:41:00",
                    title:     "Miami Echoes",
                    track:     1
                }
            };

            test.deepEqual(actual, expected);

            test.done();
        },
        'splitTitlePerformer':          function (test) {
            var value = "02:41 Dinka - Elements (EDX's 5un5hine Remix)";
            var actual = parser._splitTitlePerformer(value);
            var expected = {
                performer: "02:41 Dinka",
                title:     "Elements (EDX's 5un5hine Remix)"
            };

            test.deepEqual(actual, expected);

            test.done();
        },
        'splitTitlePerformerTitleOnly': function (test) {
            var value = "02:41 Dinka  Elements (EDX's 5un5hine Remix)";
            var actual = parser._splitTitlePerformer(value);
            var expected = {
                performer: '',
                title:     "02:41 Dinka  Elements (EDX's 5un5hine Remix)"
            };

            test.deepEqual(actual, expected);

            test.done();
        },
        'cleanDoubleQuotes':            function (test) {
            var value = 'Elements (EDX "5un5hine" Remix)';
            var actual = parser._cleanDoubleQuotes(value);
            var expected = 'Elements (EDX 5un5hine Remix)';

            test.strictEqual(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        }
    };

    var timePerformers = {
        '[08:45] 03. 8 Ball':         {
            time:    '08:45',
            residue: '] 03. 8 Ball'
        },
        '01.[18:02] Giuseppe':        {
            time:    '18:02',
            residue: '] Giuseppe'
        },
        '10:57 02. Space Manoeuvres': {
            time:    '10:57',
            residue: '02. Space Manoeuvres'
        },
        ' CJ Bolland ':               {
            time:    '',
            residue: 'CJ Bolland'
        },
        '04 Mr. Fluff':               {
            time:    '',
            residue: '04 Mr. Fluff'
        },
        '56:53 T.O.M':                {
            time:    '56:53',
            residue: 'T.O.M'
        },
        '1:02:28 Mossy':              {
            time:    '1:02:28',
            residue: 'Mossy'
        }
    };

    Object.keys(timePerformers).forEach(function (key) {
        tests['Parse: ' + key] = function (test) {
            var actual = parser._separateTime(key);
            var actualTime = actual.time;
            var actualPerformer = actual.residue;

            var expectedTime = timePerformers[key].time;
            var expectedPerformer = timePerformers[key].residue;

            test.strictEqual(actualTime, expectedTime, 'Expected: ' + expectedTime + ' | Actual: ' + actualTime);
            test.strictEqual(actualPerformer, expectedPerformer, 'Expected: ' + expectedPerformer + ' | Actual: ' + actualPerformer);

            test.done();
        };
    });


    var performers = {
        '] Giuseppe':           'Giuseppe',
        '02. Space Manoeuvres': 'Space Manoeuvres',
        '04 Mr. Fluff':         'Mr. Fluff',
        'CJ Bolland':           'CJ Bolland',
        '08) CJ Bolland':       'CJ Bolland',
        '] 03. 8 Ball':         '8 Ball'
    };

    Object.keys(performers).forEach(function (key) {
        tests['Clean time off: ' + key] = function (test) {
            var actual = parser._cleanOffTime(key);
            var expected = performers[key];

            test.strictEqual(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        };
    });


    var times = {
        '1:02:28': '62:28:00',
        '56:63':   '56:63:00',
        '':        '00:00:00'
    };

    Object.keys(times).forEach(function (key) {
        tests['Cast time: ' + key] = function (test) {
            var actual = parser._castTime(key);
            var expected = times[key];

            test.strictEqual(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        };
    });


    var regionsList = {
        ' Marker 06      01:10:38:52':         '70:38:52',
        ' 22                     02:01:50.04': '121:50:04',
        ' 22                     02:01:50,04': '121:50:04',
        ' 5541.293333    7143.640000     19':  '92:21:21',
        " 50:10:01 \n":                        '50:10:01',
        "01 120:10.01 (Split)":                  '120:10:01'
    };

    Object.keys(regionsList).forEach(function (key) {
        tests['Cast timing: ' + key] = function (test) {
            var actual = parser.regionsList(key);
            var expected = regionsList[key];

            test.strictEqual(actual[0], expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        };
    });


    return tests;

});
