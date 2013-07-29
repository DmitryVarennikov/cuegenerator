define([
], function() {

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    function getPerfomer(string)
    {
        return string.trim();
    }

    function getTitle(string)
    {
        return string.trim();
    }

    function getFilename(string)
    {
        return string.trim();
    }

    function getTracklist(string)
    {
        /**
         * Пытается отделить исполнителя от трэка
         *
         * @var string
         * @return array
         */
        var splitTitlePerfomer = function(string)
        {
            // вот такими символами могут быть разделены perfomer и title
            var separators =
                [
                    ' - ', // 45 hyphen-minus
                    ' – ', // 8211 en dash
                    ' ‒ ', // 8210 figure dash
                    ' — ', // 8212 em dash
                    ' ― ' // 8213 horizontal bar
                ];

            // foreach, switch are toooooooooo slow!

            if (-1 !== string.search(separators[0])) {
                var splitted = string.split(separators[0]);
            } else if (-1 !== string.search(separators[1])) {
                var splitted = string.split(separators[1]);
            } else if (-1 !== string.search(separators[2])) {
                var splitted = string.split(separators[2]);
            } else if (-1 !== string.search(separators[3])) {
                var splitted = string.split(separators[3]);
            } else if (-1 !== string.search(separators[4])) {
                var splitted = string.split(separators[4]);
            } else {
                var splitted = [string];
            }

            for (i = 0; i < splitted.length; i ++) {
                splitted[i].trim();
            }
            return splitted;
        }

        var tracklist = [];
        var contents = string.split('\n');

        for (i = 0, track = 1; i < contents.length; i++, track++) {

            var row = contents[i].trim();
            if (!row.length) {
                track--;
                continue;
            }

            var time = '00:00:00';
            var title_perfomer = splitTitlePerfomer(row);
            var perfomer = title_perfomer.shift();

            // search for time in front of track
            /*
             01.[18:02] Giuseppe – Fallen
             10:57 02. Space Manoeuvres - "Stage One [Tilt's Apollo 11 Mix]"
             [08:45] 03. 8 Ball - Sweet
             CJ Bolland - "The Prophet"
             */
            var matches = perfomer.match(/^(\d{2}\.)?\[?(\d{2,3}:\d{2})\]?.*$/i);
            if (null != matches && matches.length > 1) {
                time = matches[2];
                time += ':00';
            }

            //try to pick out perfomer without any garbage like number of track
            // or track time
            pattern = /^(\d{2}\.)?\[?(\d{2,3}:\d{2})?\]?\s?\d{0,2}(\s|\. )?(.*)$/i;
            perfomer = perfomer.replace(pattern, '$4');

            var title = title_perfomer.length > 0 ? title_perfomer.join(' - ') : '';


            // remove double quotes
            perfomer = perfomer.replace(/"/g, '');
            title = title.replace(/"/g, '');

            tracklist[track] =
                {
                    track: track < 10 ? '0' + track : track,
                    perfomer: perfomer,
                    title: title,
                    time: time
                };
        }

        return tracklist;
    }

    getRegionsList = function(string)
    {
        var regionsList = [];
        var contents = string.split('\n');

        line = 1;
        for (i = 0; i < contents.length; i++) {
            var row = contents[i].trim();

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
                regionsList[line] = (mn < 10 ? '0' + mn : mn) + ':' + sc + ':' + fr;

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

                regionsList[line] =
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

                regionsList[line] =
                    (mn < 10 ? '0' + mn : mn) + ':' +
                    (sc < 10 ? '0' + sc : sc) + ':' +
                    (fr < 10 ? '0' + fr : fr);

                line++;
                continue;
            }
        }

        return regionsList;
    }

    return {
        perfomer: getPerfomer,
        title: getTitle,
        filename: getFilename,
        tracklist: getTracklist,
        regionsList: getRegionsList,
    };

});