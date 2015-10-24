define([], function () {
    'use strict';

    if (! String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    function getPerformer(string) {
        return string.trim();
    }

    function getTitle(string) {
        return string.trim();
    }

    function getFilename(string) {
        return string.trim();
    }

    var splitTitlePerformer = function (string) {
        // that's how we tell performer and title apart
        var separators =
            [
                ' - ', // 45 hyphen-minus
                ' – ', // 8211 en dash
                ' ‒ ', // 8210 figure dash
                ' — ', // 8212 em dash
                ' ― ' // 8213 horizontal bar
            ];

        // foreach, switch are toooooooooo slow!
        var splitted = [],
            performer = '',
            title = '';

        if (- 1 !== string.search(separators[0])) {
            splitted = string.split(separators[0]);
        } else if (- 1 !== string.search(separators[1])) {
            splitted = string.split(separators[1]);
        } else if (- 1 !== string.search(separators[2])) {
            splitted = string.split(separators[2]);
        } else if (- 1 !== string.search(separators[3])) {
            splitted = string.split(separators[3]);
        } else if (- 1 !== string.search(separators[4])) {
            splitted = string.split(separators[4]);
        } else {
            splitted = [string];
        }

        // if we the given string wasn't splitted then we've got just title (performer assumed to be global one)
        if (1 === splitted.length) {
            performer = '';
            title = splitted.shift();
        } else {
            performer = splitted.shift();
            title = splitted.join(' ');
        }

        return {
            performer: performer.trim(),
            title:     title.trim()
        };
    };

    var separateTime = function (string) {
//        console.log(string);
        var time = '',
            residue = '';

        var pattern = /^(?:\d{2}\.)?\[?((?:\d{1,2}:)?\d{2,3}:\d{2})\]?.*$/i;
        var matches = string.match(pattern);
        if (matches && matches[1]) {
            time = matches[1].trim();
            residue = string.substring(string.indexOf(matches[1]) + matches[1].length).trim();
        } else {
            residue = string.trim();
        }

        return {
            time:    time,
            residue: residue
        };
    };

    /**
     * Accept time in format either hr:mn:sc or mn:sc
     *
     * @param {String}
     * @returns mn:sc:fr
     */
    var castTime = function (string) {
        string = string.trim();

        var pattern = /^\d{1,2}:\d{2}:\d{2}$/;
        var matches = string.match(pattern);
        if (matches) {
            var times = string.split(':');
            var hr = parseInt(times[0], 10);
            var mn = parseInt(times[1], 10);
            var sc = times[2];
            mn = hr * 60 + mn;
            string = mn + ':' + sc + ':00';
        } else {
            var pattern = /^\d{2}:\d{2}$/;
            var matches = string.match(pattern);
            if (matches) {
                string = string + ':00';
            } else {
                string = '00:00:00';
            }
        }

        return string;
    };

    var cleanOffTime = function (string) {
        var pattern = /^(?:\]? )?(?:\d{2}\)?\.? )?(.*)$/i;
        var matches = string.match(pattern);

        if (matches && matches[1]) {
            string = matches[1];
        }

        string = cleanDoubleQuotes(string);

        return string;
    };

    var cleanDoubleQuotes = function (string) {
        // remove double quotes
        string = string.replace(/"/g, '');

        return string;
    }

    /**
     * @param {String}
     * @returns {Array}
     */
    function getTracklist(string) {
        var tracklist = [],
            contents = [],
            row,
            performerTitle,
            timePerformer,
            timeTitle,
            time,
            performer,
            title;

        contents = string.split('\n');

        for (var i = 0, track = 1; i < contents.length; i ++, track ++) {

            row = contents[i].trim();
            if (! row.length) {
                track --;
                continue;
            }

            performerTitle = splitTitlePerformer(row);

            if (performerTitle.performer) {
                timePerformer = separateTime(performerTitle.performer);

                time = castTime(timePerformer.time);
                performer = cleanOffTime(timePerformer.residue);
                title = cleanDoubleQuotes(performerTitle.title);
            } else {
                timeTitle = separateTime(performerTitle.title);
                time = castTime(timeTitle.time);
                performer = '';
                title = cleanOffTime(timeTitle.residue);
            }


            tracklist.push({
                track:     track,
                performer: performer,
                title:     title,
                time:      time
            });
        }

        return tracklist;
    }

    function getRegionsList(string) {
        var regionsList = [],
            time = '';
        var contents = string.split('\n');

        for (var i = 0; i < contents.length; i ++) {
            var row = contents[i].trim();



            // Soundforge or Audition
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
                    switch (true) {
                        case - 1 != sc_fr.indexOf('.') :
                            sc_fr = sc_fr.split('.');
                            var sc = sc_fr.shift();
                            var fr = sc_fr.shift();
                            break;
                        case - 1 != sc_fr.indexOf(',') :
                            sc_fr = sc_fr.split(',');
                            var sc = sc_fr.shift();
                            var fr = sc_fr.shift();
                            break;
                    }
                }

                mn = parseInt(mn, 10) + (parseInt(hr, 10) * 60);
                time = (mn < 10 ? '0' + mn : mn) + ':' + sc + ':' + fr;
                regionsList.push(time);

                continue;
            }

            // find Nero/Winamp formats mm(m):ss(:|.)ii
            var matches = row.match(/(\d{2,3}:\d{2}[\.:]\d{2})/i);
            if (null != matches) {
                var time = matches[0].split(':');
                var mn = time.shift();
                if (time.length == 1) {
                    var sc_fr = time[0].split('.');
                    var sc = sc_fr.shift();
                    var fr = sc_fr.shift();
                } else {
                    var sc = time.shift();
                    var fr = time.shift();
                }


                time = mn + ':' + sc + ':' + fr;
                regionsList.push(time);

                continue;
            }

            // Audacity
            var matches = row.match(/(\d{1,5}).(\d{6})/i);
            if (null != matches) {
                var milliseconds = matches[2];
                var seconds = matches[1];
                var minutes = Math.floor(seconds / 60);

                var mn = minutes > 0 ? minutes : 0;
                var sc = seconds % 60;
                // frames can not be more than 74, so floor them instead of round
                var fr = Math.floor(parseFloat(0 + '.' + milliseconds) * 75);

                time =
                    (mn < 10 ? '0' + mn : mn) + ':' +
                    (sc < 10 ? '0' + sc : sc) + ':' +
                    (fr < 10 ? '0' + fr : fr);
                regionsList.push(time);

                continue;
            }

            // try to recognise raw cue timings
            var matches = row.match(/(\d{2}:\d{2}:\d{2})/i);
            if (null != matches) {
                time = matches[0].split(':');
                var mn = parseInt(time[0], 10);
                var sc = parseInt(time[1], 10);
                var fr = parseInt(time[2], 10);

                time =
                    (mn < 10 ? '0' + mn : mn) + ':' +
                    (sc < 10 ? '0' + sc : sc) + ':' +
                    (fr < 10 ? '0' + fr : fr);
                regionsList.push(time);

                continue;
            }
        }

        return regionsList;
    }

    return {
        performer:            getPerformer,
        title:                getTitle,
        filename:             getFilename,
        tracklist:            getTracklist,
        regionsList:          getRegionsList,
        _splitTitlePerformer: splitTitlePerformer,
        _separateTime:        separateTime,
        _cleanOffTime:        cleanOffTime,
        _cleanDoubleQuotes:   cleanDoubleQuotes,
        _castTime:            castTime
    };

});
