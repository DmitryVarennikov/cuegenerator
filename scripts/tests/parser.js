define([
    'cue/parser',
], function(parser) {

    var tests = {
        'title': function(test) {
            var value = ' Russia Goes Clubbing 249 (2013-07-17) (Live @ Zouk, Singapore) ';
            var actual = parser.title(value);
            var expected = 'Russia Goes Clubbing 249 (2013-07-17) (Live @ Zouk, Singapore)';
            test.strictEqual(actual, expected);

            test.done();
        },
        'perfomer': function(test) {
            var value = ' Bobina ';
            var actual = parser.perfomer(value);
            var expected = 'Bobina';
            test.strictEqual(actual, expected);

            test.done();
        },
        'filename': function(test) {
            var value = ' Bobina - Russia Goes Clubbing #249 [Live @ Zouk, Singapore].mp3 ';
            var actual = parser.filename(value);
            var expected = 'Bobina - Russia Goes Clubbing #249 [Live @ Zouk, Singapore].mp3';
            test.strictEqual(actual, expected);

            test.done();
        },
        'tracklist': function(test) {
            var value = '\
02:41 Bobina - Miami "Echoes"';
            var actual = parser.tracklist(value);
            var expected = {
                0: {
                    perfomer: "Bobina",
                    time: "02:41:00",
                    title: "Miami Echoes",
                    track: 1,
                },
            };
            test.deepEqual(actual, expected);

            test.done();
        },
        'splitTitlePerfomer': function(test) {
            var value = "02:41 Dinka - Elements (EDX's 5un5hine Remix)";
            var actual = parser._splitTitlePerfomer(value);
            var expected = ["02:41 Dinka", "Elements (EDX's 5un5hine Remix)"];

            test.deepEqual(actual, expected);

            test.done();
        },
        'splitTitlePerfomerFail': function(test) {
            var value = "02:41 Dinka  Elements (EDX's 5un5hine Remix)";
            var actual = parser._splitTitlePerfomer(value);
            var expected = ["02:41 Dinka  Elements (EDX's 5un5hine Remix)"];

            test.deepEqual(actual, expected);

            test.done();
        },
        'cleanTitle' : function(test) {
            var value = 'Elements (EDX "5un5hine" Remix)';
            var actual = parser._cleanTitle(value);
            var expected = 'Elements (EDX 5un5hine Remix)';

            test.strictEqual(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        },
    };

    var timePerfomers = {
        '[08:45] 03. 8 Ball': {
            time: '08:45',
            perfomer: '] 03. 8 Ball',
        },
        '01.[18:02] Giuseppe': {
            time: '18:02',
            perfomer: '] Giuseppe',
        },
        '10:57 02. Space Manoeuvres': {
            time: '10:57',
            perfomer: '02. Space Manoeuvres',
        },
        ' CJ Bolland ': {
            time: '',
            perfomer: 'CJ Bolland',
        },
        '04 Mr. Fluff': {
            time: '',
            perfomer: '04 Mr. Fluff',
        },
        '56:53 T.O.M': {
            time: '56:53',
            perfomer: 'T.O.M',
        },
        '1:02:28 Mossy': {
            time: '1:02:28',
            perfomer: 'Mossy',
        },
    };

    Object.keys(timePerfomers).forEach(function(key) {
        tests['Parse: ' + key] = function(test) {
            var actual = parser._splitTimePerfomer(key);
            var actualTime = actual.time;
            var actualPerfomer = actual.perfomer;

            var expectedTime = timePerfomers[key].time;
            var expectedPerfomer = timePerfomers[key].perfomer;

            test.strictEqual(actualTime, expectedTime, 'Expected: ' + expectedTime + ' | Actual: ' + actualTime);
            test.strictEqual(actualPerfomer, expectedPerfomer, 'Expected: ' + expectedPerfomer + ' | Actual: ' + actualPerfomer);

            test.done();
        };
    });


    var perfomers = {
        '] Giuseppe': 'Giuseppe',
        '02. Space Manoeuvres': 'Space Manoeuvres',
        '04 Mr. Fluff': 'Mr. Fluff',
        'CJ Bolland': 'CJ Bolland',
        '08) CJ Bolland': 'CJ Bolland',
        '] 03. 8 Ball': '8 Ball',
    };

    Object.keys(perfomers).forEach(function(key) {
        tests['Clean: ' + key] = function(test) {
            var actual = parser._cleanPerfomer(key);
            var expected = perfomers[key];

            test.strictEqual(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        };
    });


    var times = {
        '1:02:28': '62:28:00',
        '56:63': '56:63:00',
        '': '00:00:00',
    };

    Object.keys(times).forEach(function(key) {
        tests['Cast time: ' + key] = function(test) {
            var actual = parser._castTime(key);
            var expected = times[key];

            test.strictEqual(actual, expected, 'Expected: ' + expected + ' | Actual: ' + actual);

            test.done();
        };
    });


    return tests;

});