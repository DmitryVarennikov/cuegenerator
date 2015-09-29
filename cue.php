<?php
// NOT USED: see index.php for reference
session_start();

if (array_key_exists('cue', $_SESSION)) {
    
    $filename = $_SESSION['filename'] 
        ? pathinfo($_SESSION['filename'], PATHINFO_FILENAME) . '.cue'
        : 'untitled.cue';
    
    // tell ugly IE that cach can be done
    header('Cache-Control: maxage=3600');
    // and it's public
    header('Pragma: public');
    
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . $_SESSION['content_length']);
    echo trim($_SESSION['cue']);
    
    // so ugly destroy session
    $_SESSION = array();
    session_destroy();
    
    
} else {
    
    header('HTTP/1.0 404 Not Found');
    
}

exit;
