$(function()
{
    /**
     * Cue
     */
    $('#cue_fields input, #cue_fields textarea').keyup(function()
    {
        var cue = new CUEgenerator()
            .toString('perfomer', 'title', 'filename', 'tracklist', 'regions_list');

        $('textarea#cue').val(cue);
    });
    
    $('textarea#cue').one('click', function()
    {
        $(this).select();
    });
    
    
    /**
    * Document layout
    * 
    */
    var height = $(document).height() - 20;
    $('#cue_fields textarea#tracklist').animate({height: height - 350});
    $('#cue').animate({height: height - 173});
    
});