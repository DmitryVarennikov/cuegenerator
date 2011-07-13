<?php

function tmp_get_date($value, $format) {
    return is_array($value)
        // если указано непустое значение хотя бы для одного из полей
        ? (count(array_filter($value)) > 0
            // форматируем дату в строку - для БД и для Smarty
            ? vsprintf('%04d-%02d-%02d', array_extract($value, array('Year', 'Month', 'Day'), 1))
            : null)
        : (false !== ($timestamp = parse_date($value, $format))
            ? date('Y-m-d', $timestamp)
            : null);
}

function tmp_get_time($value) {
    if ('pm' == strtolower(@$value['Meridian'])) {
        $value['Hour'] = ($value['Hour'] + 12) % 24;
    }
    return vsprintf('%02d:%02d:%02d', array_extract($value, array('Hour', 'Minute', 'Second'), 0));
}

function parse_date($date, $format) {

    // build up date pattern from the given $format, keeping delimiters in place
    if (!preg_match_all('/%([YmdHMp])([^%])*/', $format, $tokens, PREG_SET_ORDER)) {
        return false;
    }

    $pattern = '';

    foreach ($tokens as $token) {
        $pattern .= '(.*)'.preg_quote(isset($token[2]) ? $token[2] : '', '/');
    }

    // Splits up the given $date
    if (!preg_match('/' . $pattern . '/', $date, $dateTokens)) {
        return false;
    }

    $segments = array();

    for ($i = 0; $i < count($tokens); $i++) {
        $segments[$tokens[$i][1]] = $dateTokens[$i+1];
    }

    // Reformats the given $date into US English date format, suitable for strtotime()
    if ($segments['Y'] && $segments['m'] && $segments['d']) {
        $reformated = $segments['Y'] . '-' . $segments['m'] . '-' . $segments['d'];

        if (isset($segments['H']) && isset($segments['M'])) {
            $reformated .= ' ' . $segments['H'] . ':' . $segments['M'];
        }

        return strtotime($reformated);
    }

    return false;
}