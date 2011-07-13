<?php

/**
 * @desc Walk round array recursively and apply specified function to the every 
 * element changing it to result. 
 *
 * @param   array   $input
 * @param   callback    $funcname
 */
function array_apply_recursive(&$input, $funcname) 
{
    array_walk_recursive($input, create_function('&$value', '$value = ' . $funcname . '($value);'));
}

/**
 * @desc Check whether element with specified index exists in array. Array is 
 * walked round recursively. 
 *
 * @param   array   $needle
 * @param   mixed   $haystack
 * @return  boolean
 */
function in_array_recursive($needle, $haystack) 
{
    foreach ($haystack as $value) {
        if (is_array($value)) {
            if (in_array_recursive($needle, $value)) {
                return true;
            }
        }
        elseif ($value == $needle) {
            return true;
        }
    }
    return false;
}

/**
 * @desc Return input array keys which values are not arrays (tree leaves). 
 *
 * @param   array   $input
 * @return  array
 */
function array_keys_recursive($input) 
{
    $keys = array();
    foreach ($input as $key => $value) {
        $keys = array_merge($keys, is_array($value) ? array_keys_recursive($value) : array($key));
    }
    return array_unique($keys);
}

/**
 * Разворачивает сложный массив в плоский. Может быть использован для методов,
 * которые принимают переменное число аргументов как в массиве, так и по отдельности.
 *
 * @param   array   $input
 * @return  array
 */
function array_values_recursive($input) 
{
    $values = array();
    foreach ($input as $value) {
        $values = array_merge($values, is_array($value) ? array_values_recursive($value) : array($value));
    }
    return $values;
}

/**
 * @desc Return input array elements with keys specified. Order of elements 
 * preserved. 
 *
 * @param   array   $input
 * @param   array   $keys
 * @param   mixed   $default
 * @return  array
 */
function array_extract($input, $keys, $default = null) 
{
    $result = array();
    $fill = func_num_args() > 2;
    foreach ($keys as $key) {
        if (array_key_exists($key, $input)) {
            $result[$key] = $input[$key];
        } elseif ($fill) {
            $result[$key] = $default;
        }
    }
    return $result;
}

/**
 * @desc Check whether input array is numeric (i.e. list)
 *
 * @param   array   $array
 * @return  boolean
 */
function is_numeric_array($array) 
{
    return is_array($array) && array_keys($array) === range(0, count($array) - 1);
}

/**
 * @desc Return input array value with key specified or default if it doesn't exists. 
 *
 * @param   array   $array
 * @param   mixed   $key
 * @param   mixed   $default
 * @return  mixed
 */
function get_array_element($array, $key, $default = null) 
{
    return array_key_exists($key, $array) ? $array[$key] : $default;
}



/**
 * @desc Convert string from "foo-bar-baz" notation into "fooBarBaz" (Camel case?). 
 *
 * @param   string  $string
 * @return  string
 */
function str_camelize($string) 
{
    return preg_replace('/(^|\-)([a-z])/e', "strtoupper('\\2')", $string);
}

/**
 * @desc Move element with specified key to the specified position in the input 
 * array. 
 *
 * @param   array   $input
 * @param   mixed   $key
 * @param   integer $position
 * @return  boolean
 */
function array_set_element_position(&$input, $key, $position) 
{
    if (false === ($current = array_search($key, array_keys($input)))
        || $current == $position) {
        return false;
    }
    
    // make slices preserve original keys
    switch (true) 
    {
        case $current < $position;
            $slices = array(
                array_slice($input, 0, $current, true),
                array_slice($input, $current + 1, $position - $current, true),
                array_slice($input, $current, 1, true),
                array_slice($input, $position, count($input), true),
            );
            break;
        case $current > $position;
            $slices = array(
                array_slice($input, 0, $position, true),
                array_slice($input, $current, 1, true),
                array_slice($input, $position, $current - $position, true),
                array_slice($input, $current, count($input), true),
            );
            break;
    }
    
    // zeroize original input array and build it using slices
    $input = array();
    foreach ($slices as $slice) {
        $input = $input + $slice;
    }
    return true;
}

/**
 * @desc Return value for specified directive in bytes. 
 *
 * @param   string  $varname
 * @return  integer
 */
function ini_get_bytes($varname) 
{
   $value = trim(ini_get($varname));
   $last = strtolower($value{strlen($value)-1});
   switch ($last) {
       case 'g':
           $value *= 1024;
       case 'm':
           $value *= 1024;
       case 'k':
           $value *= 1024;
   }
   return (int)$value;
}

/**
 * Преобразует целочисленное значение в массив значений 2^N, которые в сумме
 * дают это значение.
 *
 * @param   integer  $value
 * @return  array
 */
function dec2array($value) 
{
    $bits = array();
    for ($i = strlen(($bin = decbin($value))); $i >= 0; $i--) {
        if (substr($bin, $i, 1)) {
            $bits[] = pow(2, $i);
        }
    }
    return $bits;
}

require dirname(__FILE__) . DIRECTORY_SEPARATOR . 'tmp_date.php';


/**
* @desc Return source value with postfix if it's needed. 
* 
* @param string 
* 
* @return string 
*/
function __postfix($value) 
{
    // we imply that value needs postfix in case of:
    // - application is multilanguage and  
    // - default language is not current one
    if (Application::getRequest()->isMultilang() && 
        defined('LANGUAGE') &&
        __lang() != constant('LANGUAGE')) 
    {
        return $value . '_' . __lang();
    }
    
    // otherwise value does not need postfix
    return $value;
}

/**
* @desc Walk through array values applying Kernel_i18n::get()
* 
* @param array $input
* @return array
*/
function __array($input) 
{
    return array_map(create_function('$value', 'return __(utf8_uppercase($value));'), $input);
}

/**
 * @desc Return file extension by its name. 
 *
 * @param   string  $filename
 * @return  string
 */
function get_extension($file_name) 
{
    return strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
}

/**
 * @desc Generate random file name with specified extension. 
 *
 * @param   string $ext
 * @return  string
 */
function generate_file_name($ext)
{
    return substr(md5(uniqid()), 0, 8) . '.' . $ext;
}

/**
* Generate file name if file with such name already exists.
* 
* @param string
* @param string
* @return string
*/
function get_file_name($file, $dir) 
{
    // in any case cut name to 8 symbols
    $file = substr(pathinfo($file, PATHINFO_FILENAME), 0, 8) . 
        '.' . $extension = pathinfo($file, PATHINFO_EXTENSION);
    
    if (in_array($file, scandir($dir))) {
        $file = generate_file_name($extension);
    }
    
    return $file;
}

/**
* Try to bring URL to the normal form.
* 
* @param string     $url
* 
* @return string
*/
function url($url) 
{
    return str_replace(' ', '-', strtolower(trim($url, '/')));
}

/**
* Transliteration
* 
* @param string $st
* @return string
*/
function transliterate($st) 
{
    $lit = array(
        "а" => "a",
        "б" => "b",
        "в" => "v",
        "г" => "g",
        "д" => "d",
        "е" => "e",
        "ё" => "yo",
        "ж" => "g",
        "з" => "z",
        "и" => "i",
        "й" => "y",
        "к" => "k",
        "л" => "l",
        "м" => "m",
        "н" => "n",
        "о" => "o",
        "п" => "p",
        "р" => "r",
        "с" => "s",
        "т" => "t",
        "у" => "u",
        "ф" => "f",
        "х" => "h",
        "ц" => "ts",
        "ч" => "ch",
        "ш" => "sh",
        "щ" => "shch",
        "ъ" => "",
        "ы" => "i",
        "ь" => "",
        "э" => "e",
        "ю" => "yu",
        "я" => "ya",

        "А" => "A",
        "Б" => "B",
        "В" => "V",
        "Г" => "G",
        "Д" => "D",
        "Е" => "E",
        "Ё" => "Yo",
        "Ж" => "G",
        "З" => "Z",
        "И" => "I",
        "Й" => "Y",
        "К" => "K",
        "Л" => "L",
        "М" => "M",
        "Н" => "N",
        "О" => "O",
        "П" => "P",
        "Р" => "R",
        "С" => "S",
        "Т" => "T",
        "У" => "U",
        "Ф" => "F",
        "Х" => "H",
        "Ц" => "Ts",
        "Ч" => "Ch",
        "Ш" => "Sh",
        "Щ" => "Shch",
        "Ъ" => "",
        "Ы" => "I",
        "Ь" => "",
        "Э" => "E",
        "Ю" => "Yu",
        "Я" => "Ya",
    );
return $st = strtr($st, $lit);
}

/**
* Return string in <sup> tags.
* 
* @param string
* @return string
*/
function sup($string = 'readonly') 
{
    return sprintf(' <sup>%s</sup>', __(utf8_uppercase($string)));
}

/**
* Return ip.
* 
* @return string
*/
function get_ip()
{
    if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"),"unknown"))
    $ip = getenv("HTTP_CLIENT_IP");

    elseif (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
    $ip = getenv("HTTP_X_FORWARDED_FOR");

    elseif (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
    $ip = getenv("REMOTE_ADDR");

    elseif (!empty($_SERVER['REMOTE_ADDR']) && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
    $ip = $_SERVER['REMOTE_ADDR'];

    else
    $ip = "unknown";

    return($ip);
}