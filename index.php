<?php
require_once '_config.php';
require_once '_kernel/utils.inc.php';

function increment_counter() 
{
    file_put_contents(COUNTER_FILENAME, 
        (int)file_get_contents(COUNTER_FILENAME) + 1);
}

function log_cue() 
{
    require_once '_kernel/Db.php';
    require_once '_kernel/Db/Exception.php';
    
    try {
        database::connect();
        
        $affected_rows = database::replace('cues', array_extract($_POST, 
            array('perfomer', 'title', 'filename', 'tracklist', 'regions_list', 'cue')));
        
    } catch(Kernel_Db_Exception $exception) {
        if (DEBUG_MODE) {
            var_dump($exception->getMessage());
            exit;
        }
    }
    
    return $affected_rows;
}


if ('post' == strtolower($_SERVER['REQUEST_METHOD']) && 
    strlen(trim($_POST['cue']))) 
{
    session_start();
    if (get_magic_quotes_gpc()) {
        $_POST = array_map('stripslashes', $_POST);
    }
    $_SESSION['cue'] = $_POST['cue'];
    $_SESSION['filename'] = $_POST['filename'];
    $_SESSION['content_length'] = $_SERVER['CONTENT_LENGTH'];
    
    $meta_refresh = '<meta http-equiv="refresh" content="1; url=/cue.php" />';
    
    
    //if (log_cue() == 1) {
        increment_counter();
    //}
} 

require_once 'index.html';