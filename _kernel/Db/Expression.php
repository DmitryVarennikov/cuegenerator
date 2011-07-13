<?php

/**
 * SQL-выражение в чистом виде.
 *
 */
class Kernel_Db_Expression
{
    /**
     * Строковое представление выражения
     *
     * @var string
     */
    private $_string = '';

    /**
     * Конструктор
     *
     * @param   string  $string
     */
    public function __construct($string)
    {
        $this->_string = $string;
    }

    /**
     * Возвращает строковое представление объекта
     *
     * @return  string
     */
    public function __toString()
    {
        return $this->_string;
    }
}
