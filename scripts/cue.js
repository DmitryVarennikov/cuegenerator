
/**
* Collect cue properties by the given ids and form cue sheet
* 
*/
function Cue(perfomer_id, title_id, filename_id, tracklist_id, regions_list_id) 
{
    /**
    * Characters list splitting title and perfomer
    * 
    * @var array
    */
    this.separators = 
    [
        ' - ', // 45 hyphen-minus
        ' – ', // 8211 en dash
        ' ‒ ', // 8210 figure dash
        ' — ', // 8212 em dash 
        ' ― ' // 8213 horizontal bar
    ];
    
    /**
    * Cue sheet properties
    * 
    */
    this.perfomer = $('#' + perfomer_id).val();
    this.title = $('#' + title_id).val();
    this.filename = $('#' + filename_id).val();
    
    this.tracklist = this.getTracklist(tracklist_id);
    this.regions_list = this.getRegionsList(regions_list_id);
}

/**
* Collect tracklist from the field with given id
* 
* @return array
*/
Cue.prototype.getTracklist = function(tracklist_id) 
{
    var tracklist = new Array();
    var contents = $('#' + tracklist_id).val().split('\n');
    
    for (i=0, track=1; i<contents.length; i++, track++) {
            
        var row = $.trim(contents[i]);
        if (!row.length) {track--;continue;}
        
        var time = '00:00:00';
        var title_perfomer = this.split(row);
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
        
        tracklist[track]= 
        {
               track : track < 10 ? '0' + track : track, 
            perfomer : perfomer, 
               title : title, 
                time : time
        };
    }
    
    return tracklist;
}

/**
* Try to split string using separators list
* 
* @return mixed
*/
Cue.prototype.split = function(string) 
{
    // foreach, switch are toooooooooo slow!
    
    if (-1 !== string.search(this.separators[0])) {
        var splitted = string.split(this.separators[0]);
    } else if (-1 !== string.search(this.separators[1])) {
        var splitted = string.split(this.separators[1]);
    } else if (-1 !== string.search(this.separators[2])) {
        var splitted = string.split(this.separators[2]);
    } else if (-1 !== string.search(this.separators[3])) {
        var splitted = string.split(this.separators[3]);
    } else if (-1 !== string.search(this.separators[4])) {
        var splitted = string.split(this.separators[4]);
    } else {
        var splitted = [string];
    }
    
    return $.map(splitted, function(string) {return $.trim(string);});
}

/**
* Collect time markers from the field with given id
* 
* @return array
*/
Cue.prototype.getRegionsList = function(regions_list_id) 
{
    var regions_list = new Array();
    var contents = $('#' + regions_list_id).val().split('\n');

    line=1;
    for (i=0; i<contents.length; i++) {
        var row = $.trim(contents[i]);

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
                switch(true)
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
        }

        var matches = row.match(/(\d{1,5}).(\d{6})/i);
        if (null != matches) {
            var milliseconds = matches[2];
            var seconds = matches[1];
            var minutes = Math.floor(seconds / 60);
            
            var mn = minutes > 0 ? minutes : 0;
            var sc = seconds % 60;
	    // frames can not be more than 74, so floor them instead of round
            var fr = Math.floor(parseFloat (0 + '.' + milliseconds) * 75);
            
            regions_list[line] =
                (mn < 10 ? '0' + mn : mn) + ':' +
                (sc < 10 ? '0' + sc : sc) + ':' +
                (fr < 10 ? '0' + fr : fr);

            line++;
        }
    }
    
    return regions_list;
}

/**
* Form cue sheet
* 
* @return string
*/
Cue.prototype.toString = function() 
{
    var string = '';
    
    string += 'PERFORMER "' + this.perfomer + '"\n';
    string += 'TITLE "' + this.title + '"\n';
    string += 'FILE "' + this.filename + '" MP3\n';
    
    for (i=1; i<this.tracklist.length; i++) {
        var row = this.tracklist[i];
        
        string += '  TRACK ' + row.track + ' AUDIO\n';
        string += '    PERFORMER "' + row.perfomer + '"\n';
        string += '    TITLE "' + row.title + '"\n';
        string += '    INDEX 01 ' + 
            (this.regions_list[i] ? this.regions_list[i] : row.time) + '\n';
    }
    
    return string;
}