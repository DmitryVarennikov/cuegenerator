<?php
require_once '_config.php';

function increment_counter() 
{
    file_put_contents(COUNTER_FILENAME, 
        (int)file_get_contents(COUNTER_FILENAME) + 1);
}


if ('post' == strtolower($_SERVER['REQUEST_METHOD']) && strlen(trim($_POST['cue']))) {
    increment_counter();

    $filename = !empty($_POST['filename'])
        ? pathinfo($_POST['filename'], PATHINFO_FILENAME) . '.cue'
        : 'untitled.cue';

    // tell ugly IE that cach can be done
    header('Cache-Control: maxage=3600');
    // and it's public
    header('Pragma: public');

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . $_SERVER['content_length']);
    echo chr(0xEF) . chr(0xBB) . chr(0xBF); // BOM for UTF-8
    echo trim($_POST['cue']);

//    session_start();
//    if (get_magic_quotes_gpc()) {
//        $_POST = array_map('stripslashes', $_POST);
//    }
//    $_SESSION['cue'] = $_POST['cue'];
//    $_SESSION['filename'] = $_POST['filename'];
//    $_SESSION['content_length'] = $_SERVER['CONTENT_LENGTH'];
//
//    $meta_refresh = '<meta http-equiv="refresh" content="1; url=/cue.php" />';
    
    
    increment_counter();
} else {
    require_once 'index.html';
}
