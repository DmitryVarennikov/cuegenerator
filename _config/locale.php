<?php

$locale = isset($_SERVER['HTTP_HOST'])
    ? ((DEBUG_MODE ? 'su' : 'ru') == substr($_SERVER['HTTP_HOST'], -2, 2) ? 'ru' : 'en')
    : 'en';


defined('LOCALE') or define('LOCALE', $locale);
unset($locale);