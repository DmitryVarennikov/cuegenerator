function CUEgenerator()
{ 
    this.parser = new CUEgenerator_Parser();
    this.formatter = new CUEgenerator_Formatter();
}

CUEgenerator.prototype.toString = function(perfomer_id, title_id, filename_id,
    tracklist_id, regions_list_id)
{
    var output = '';
    
    output += this.formatter.getPerfomer(this.parser.getPerfomer($('#' + perfomer_id).val()));
    output += this.formatter.getTitle(this.parser.getTitle($('#' + title_id).val()));
    output += this.formatter.getFilename(this.parser.getFilename($('#' + filename_id).val()));
    output += this.formatter.getTracklist(
        this.parser.getTracklist($('#' + tracklist_id).val()),
        this.parser.getRegionsList($('#' + regions_list_id).val()));
    
    return output;
}