<?php
require_once '_config.php';

function increment_counter() 
{
    file_put_contents(COUNTER_FILENAME, 
        (int)file_get_contents(COUNTER_FILENAME) + 1);
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
    
    
    increment_counter();
} 

require_once 'index.html';