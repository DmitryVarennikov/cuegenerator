function CUEgenerator_Formatter()
{ }

CUEgenerator_Formatter.prototype.getPerfomer = function(string)
{
    return 'PERFORMER "' + string + '"\n';
}

CUEgenerator_Formatter.prototype.getTitle = function(string)
{
    return 'TITLE "' + string + '"\n';
}

CUEgenerator_Formatter.prototype.getFilename = function(string)
{
    return 'FILE "' + string + '" MP3\n';
}

CUEgenerator_Formatter.prototype.getTracklist = function(tracklist, regions_list)
{
    var output = '';

    for (i = 1; i < tracklist.length; i ++) {
        var row = tracklist[i];

        output += '  TRACK ' + row.track + ' AUDIO\n';
        output += '    PERFORMER "' + row.perfomer + '"\n';
        output += '    TITLE "' + row.title + '"\n';
        output += '    INDEX 01 ' +
            (regions_list[i] ? regions_list[i] : row.time) + '\n';
    }

    return output;
}