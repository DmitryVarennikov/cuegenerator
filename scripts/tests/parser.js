var getRegionsList = function(string)
{
    var regions_list = new Array();
    var contents = string.split('\n');

    line = 1;
    for (i = 0; i < contents.length; i++) {

//        var row = $.trim(contents[i]);
        var row = contents[i];

        // find matches of soundforge or audacity format

        var matches = row.match(/(\d{2}:\d{2}:\d{2}[\.,:]\d{2})/i);
        if (null != matches) {
            var time = matches[0].split(':');
            var hr = time.shift();
            var mn = time.shift();



            // frames can be separated by .(dot) or :(colon) or ,(comma)
            if (time.length > 1) {
                var sc = time.shift();
                var fr = time.shift();
            } else {
                var sc_fr = time.shift();
                switch (true)
                {
                    case -1 != sc_fr.indexOf('.') :
                        sc_fr = sc_fr.split('.');
                        var sc = sc_fr.shift();
                        var fr = sc_fr.shift();
                        break;
                    case -1 != sc_fr.indexOf(',') :
                        sc_fr = sc_fr.split(',');
                        var sc = sc_fr.shift();
                        var fr = sc_fr.shift();
                        break;
                }
            }

            mn = parseInt(mn, 10) + (parseInt(hr, 10) * 60);
            regions_list[line] = (mn < 10 ? '0' + mn : mn) + ':' + sc + ':' + fr;

            line++;
            continue;
        }


        var matches = row.match(/(\d{1,5}).(\d{6})/i);
        if (null != matches) {
            var milliseconds = matches[2];
            var seconds = matches[1];
            var minutes = Math.floor(seconds / 60);

            var mn = minutes > 0 ? minutes : 0;
            var sc = seconds % 60;
            // frames can not be more than 74, so floor them instead of round
            var fr = Math.floor(parseFloat(0 + '.' + milliseconds) * 75);

            regions_list[line] =
                (mn < 10 ? '0' + mn : mn) + ':' +
                (sc < 10 ? '0' + sc : sc) + ':' +
                (fr < 10 ? '0' + fr : fr);

            line++;
            continue;
        }

        // try to recognise raw cue timings
        var matches = row.match(/(\d{2}:\d{2}:\d{2})/i);
        if (null != matches) {
            var time = matches[0].split(':');
            var mn = parseInt(time[0], 10);
            var sc = parseInt(time[1], 10);
            var fr = parseInt(time[2], 10);

            regions_list[line] =
                (mn < 10 ? '0' + mn : mn) + ':' +
                (sc < 10 ? '0' + sc : sc) + ':' +
                (fr < 10 ? '0' + fr : fr);

            line++;
            continue;
        }
    }

    return regions_list;
};



var perfomers = [
    '01.[18:02] Giuseppe – Fallen',
    '10:57 02. Space Manoeuvres - "Stage One [Tilt\'s Apollo 11 Mix]"',
    '[08:45] 03. 8 Ball - Sweet',
];

this.parser = {};
perfomers.forEach(function(perfomer) {
    this.parser[perfomer] = function(test) {
        var matches = perfomer.match(/^(\d{2}\.)?\[?(\d{2,3}:\d{2})\]?.*$/i);
        if (null != matches && matches.length > 1) {
            test.ok(true, matches[2]);
        } else {
            test.ok(false);
        }

        test.done();
    };
});


var timings = [
    '00:12:65:32',
    '723.213333     1010.439546',
    '01:05:49.30',
    '01:05:49,30    01:05:49,30     01:05:49,30',
    "TRACK 01 AUDIO \n\
      INDEX 01 10:45:00",
];

timings.forEach(function(timing) {
    this.parser[timing] = function(test) {
        var result = getRegionsList(timing);
        console.log(result);
        test.ok(result[1], result[1]);

        test.done();
    };
});