<?php

/**
 * Объектная обертка для функций работы с MySQL.
 *
 * :WARNING: morozov 18052007: за всеми собаками в этом классе следует вызов
 * trigger_error уровня E_USER_ERROR. если запрос не выполнился — это ошибка
 * программиста или конфигурации, и дальше подолжать выполнение приложения
 * не имеет смысла. а собаки — затем, чтобы одно и то же сообщение об ошибке
 * не валилось дважды. мы не игногигруем его, а переводим на более высокий уровень.
 */
abstract class Kernel_Db 
{

    /**
     * Оборачивание данных при сравнении.
     *
     */
    const WRAP_COMPARISION = 0;

    /**
     * Оборачивание данных при присваивании.
     *
     */
    const WRAP_ASSIGNMENT  = 1;

    /**
     * Идентификатор соединения с БД.
     *
     * @var resource
     */
    static private $_conn;

    /**
     * Результат последнего выполненного запроса.
     *
     * @var resource
     */
    static private $_result;

    /**
     * Счетчик запорсов.
     *
     * @var integer
     */
    static private $_counter = 0;

    /**
     * Подключается к базе данных.
     *
     */
    static public function connect() 
    {
        switch (false) {
            case function_exists('mysql_connect'):
                self::_error('MySQL extension is not loaded');
                break;
            case self::$_conn = @mysql_connect(DB_HOST, DB_USER, DB_PASSWORD):
                self::_error(mysql_error(self::$_conn), mysql_errno(self::$_conn));
                break;
            case mysql_select_db(DB_NAME):
                self::_error(mysql_error(self::$_conn), mysql_errno(self::$_conn));
                break;
            default:
                self::query('SET CHARACTER SET "utf8"');
                self::query('SET NAMES "utf8"');
                self::query('SET time_zone = "' . date_default_timezone_get() . '"');
                break;
        }
    }

    /**
     * Выполняет запрос.
     *
     * @param   string  $query Строка запроса
     */
    static public function query($query) 
    {
        self::$_counter++;
        if (false === (self::$_result = @mysql_query($query, self::$_conn))) {
            self::_error(mysql_error(self::$_conn), mysql_errno(self::$_conn), $query);
        }
    }

    /**
     * Оборачивает строку в выражение.
     *
     * @param   string  $string
     * @return  Kernel_Db_Expression
     */
    static public function expression($string) 
    {
        return new Kernel_Db_Expression($string);
    }

    /**
     * Вставляет данные в таблицу и возвращает идентификатор созданной записи.
     *
     * @param   string  $table
     * @param   array   $values
     * @param   boolean $ignore
     * @return  integer
     */
    static public function insert($table, $values, $ignore = false) 
    {
        foreach (is_numeric_array($values) ? $values : array($values) as $record) {
            $query = 'INSERT' . self::_ignore($ignore) .  ' INTO
                             `' . $table . '`';
            switch (true) {
                case $record instanceof Kernel_Db_Expression:
                    $query .= $record->__toString();
                    break;
                case !empty($record):
                    $query .= '
                         SET
                             ' . self::values($record);
                    break;
                default:
                    $query .= '
                             VALUES()';
                    break;
            }
            self::query($query);
        }
        return self::nextid();
    }

    /**
     * Вставляет данные в таблицу и возвращает идентификатор созданной записи.
     *
     * @param   string  $table
     * @param   array   $values
     */
    static public function replace($table, $values) 
    {
        foreach (is_numeric_array($values) ? $values : array($values) as $row) {
            $query = 'REPLACE
                              `' . $table . '`
                          SET
                              ' . self::values($row);
            self::query($query);
        }
        
        return self::affectedRows();
    }

    /**
     * Обновляет данные в таблице.
     *
     * @param   string  $table
     * @param   array   $values
     * @param   mixed   $condition
     * @param   boolean $ignore
     * @return  integer
     */
    static public function update($table, $values, $condition = null, $ignore = false) 
    {
        $query = 'UPDATE' . self::_ignore($ignore) .  '
                         `' . $table . '`
                     SET
                         ' . self::values($values) . self::_condition($condition);
        self::query($query);
        return self::affectedRows();
    }

    /**
     * Обновляет запись с указанным ключом, если она существует, или создает ее.
     *
     * @param   string  $table
     * @param   array   $values
     * @param   array   $condition
     */
    static public function updateAssoc($table, $values, $condition) 
    {
        $query = 'SELECT
                         COUNT(*)
                    FROM
                         `' . $table . '`'  . self::_condition($condition);
        if (self::fetchOne($query) > 0) {
            database::update($table, $values, $condition);
        } else {
            database::insert($table, array_merge($values, $condition));
        }
    }

    /**
     * Удаляет данные из таблицы.
     *
     * @param   string  $table
     * @param   mixed   $condition
     * @param   boolean $ignore
     * @return  integer
     */
    static public function delete($table, $condition, $ignore = false) 
    {
        $query = 'DELETE' . self::_ignore($ignore) .  '
                    FROM
                         `' . $table . '`' . self::_condition($condition);
        self::query($query);
        return self::affectedRows();
    }

    /**
     * Экранирует строку.
     *
     * @param   string  $string
     * @return  string
     */
    static public function escape($string) 
    {
        return mysql_real_escape_string($string);
    }

    /**
     * Выполняет запрос, извлекает все столбцы все строки в виде индексного
     * массива.
     *
     * @param   string  $query Строка запроса
     * @return  array
     */
    static public function fetchAll($query) 
    {
        $result = array();
        self::query($query);
        if (false !== self::$_result) {
            while (false !== ($row = self::_fetch())) {
                $result[] = $row;
            }
            self::_free();
        }
        return $result;
    }

    /**
     * Выполняет запрос, извлекает все столбцы все строки в виде ассоциативного
     * массива. Первый элемент - ключ, массив остальных - значение.
     *
     * @param   string  $query Строка запроса
     * @return  array
     */
    static public function fetchAssoc($query) 
    {
        $result = array();
        self::query($query);
        if (false !== self::$_result) {
            while (false !== ($row = self::_fetch())) {
                $result[array_shift($row)] = $row;
            }
            self::_free();
        }
        return $result;
    }

    /**
     * Выполняет запрос, извлекает одно значение. Возвращает FALSE, если запрос
     * не вернул ни одной записи.
     *
     * @param   string  $query Строка запроса
     * @return  array
     */
    static public function fetchOne($query) 
    {
        $result = false;
        self::query($query);
        if (false !== self::$_result) {
            if (self::numRows() > 0) {
                $dummy = self::_fetch();
                $result = reset($dummy);
            }
            self::_free();
        }
        return $result;
    }

    /**
     * Выполняет запрос, извлекает одну строку. Возвращает NULL, если запрос
     * не вернул ни одной записи.
     *
     * @author  Sergei Morozov   <smorozov@minsk.artics.ru>
     *
     * @param   string  $query Строка запроса
     * @return  array
     */
    static public function fetchRow($query) 
    {
        $result = null;
        self::query($query);
        if (false !== self::$_result) {
            if (self::numRows() > 0) {
                $result = self::_fetch();
            }
            self::_free();
        }
        return $result;
    }

    /**
     * Выполняет запрос, извлекает один столбец для всех строк.
     *
     * @param   string  $query Строка запроса
     * @return  array
     */
    static public function fetchCol($query) 
    {
        $result = array();
        self::query($query);
        if (false !== self::$_result) {
            while (false !== ($row = self::_fetch())) {
                $result[] = reset($row);
            }
            self::_free();
        }
        return $result;
    }

    /**
     * Выполняет запрос, извлекает извлечение последовательность пар
     * ключ-значение. Первый столбец является ключом массива,
     * второй - значением массива
     *
     * @param   string  $query Строка запроса
     * @return  array
     */
    static public function fetchPairs($query) 
    {
        $result = array();
        self::query($query);
        if (false !== self::$_result) {
            while (false !== ($row = self::_fetch())) {
                $result[current($row)] = next($row);
            }
            self::_free();
        }
        return $result;
    }

    /**
     * Возвращает количество записей, которое затронул последний запрос.
     *
     * @return  integer
     */
    static public function affectedRows() 
    {
        return mysql_affected_rows(self::$_conn);
    }

    /**
     * Возвращает количество записей, которые вернул последний выполненый запрос.
     *
     * @return  integer
     */
    static public function numRows() 
    {
        return mysql_num_rows(self::$_result);
    }

    /**
     * Возвращает идентификатор последней созданной записи.
     *
     * @return  integer
     */
    static public function nextid() 
    {
        return mysql_insert_id(self::$_conn);
    }

    /**
     * Возвращает количество выполненных запросов.
     *
     * @return  integer
     */
    static public function count() 
    {
        return self::$_counter;
    }

    /**
     * Формирует значение опции IGNORE
     *
     * @param   boolean $value
     * @return  string
     */
    static private function _ignore($value) 
    {
        return $value ? ' IGNORE' : '';
    }

    /**
     * Возвращает запись из результата последнего выполненного запроса.
     *
     * @return  array
     */
    static private function _fetch() 
    {
        return mysql_fetch_assoc(self::$_result);
    }

    /**
     * Высвобождает память, занятую результатом последнего выполненного запроса.
     *
     */
    static private function _free() 
    {
        mysql_free_result(self::$_result);
    }

    /**
     * Оборачивает массив данных для записи в SQL-выражение.
     *
     * @param   array   $values
     * @return  string
     */
    static private function _wrap($values, $delimiter, $case) 
    {
        if (empty($values)) {
            return true;
        }
        $fields = array();
        foreach ($values as $field => $value) {
            if (true !== ($operand = self::_compare($value, $case))) {
                $fields[] .= (false === strpos($field, '`')
                    ? '`' . $field . '`'
                    : $field) . ' ' . $operand;
            }
        }
        return implode($delimiter . "\n", $fields);
    }

    static private function _compare($value, $case) 
    {
        switch (true) {
            case is_null($value):
                switch ($case) {
                    case self::WRAP_ASSIGNMENT:
                        $operand = '= NULL';
                        break;
                    case self::WRAP_COMPARISION:
                        $operand = 'IS NULL';
                        break;
                }
                break;

            case is_numeric_array($value):
                $operand = self::_in($value);
                break;

            case $value instanceof Kernel_Db_Expression:
                $operand = '= ' . $value->__toString();
                break;

            case $value instanceof Kernel_Range:
                $operand = self::_range($value->left(), $value->right());
                break;

            default:
                $operand = '= ' . self::_quotize($value);
                break;
        }

        return $operand;
    }

    /**
     * Оборачивает нечисловое значение в кавычки для подстановки в запрос.
     * По идее, даже числовые значения надо оборачивать в кавычки, иначе,
     * например, у числового значения строкового поля при формирования запроса
     * обрежутся нули в начале.
     *
     * @param   mixed   $value
     * @return  string
     */
    static private function _quotize($value) 
    {
        return '"' . self::escape($value) . '"';
    }

    /**
     * Формирует SQL-выражение для множества значений.
     *
     * @param   array   $values
     * @return  string
     */
    static private function _in($values) 
    {
        return 'IN(' . implode(', ', array_map(array('self', '_quotize'), $values)) . ')';
    }

    /**
     * Формирует SQL-выражение для проверки вхождения значения в диапазон.
     *
     * @param   mixed   $left
     * @param   mixed   $right
     * @return  string
     */
    static private function _range($left, $right) 
    {
        $_left = null !== $left; $_right = null !== $right;
        switch (true) {
            case $_left && $_right:
                return 'BETWEEN "' . $left . '" AND "' . $right . '"';
            case $_left:
                return '>= "' . $left . '"';
            case $_right:
                return '<= "' . $right . '"';
            default:
                return true;
        }
    }

    /**
     * Формирует SQL-условие WHERE.
     *
     * @param   array   $params
     * @return  string
     */
    static public function condition($params) 
    {
        switch (true) {
            case is_numeric($params):
                $condition = '`id` = ' . $params;
                break;
            case is_numeric_array($params):
                $condition = '`id` ' . self::_in($params);
                break;
            case is_array($params):
                // попробуем, авось что получится
                $condition = self::_wrap($params, ' AND ', self::WRAP_COMPARISION);
                break;
            default:
                // просто присоединяем строку
                $condition = $params;
                break;
        }
        return $condition;
    }

    /**
     * Формирует SQL-выражение из ассоциативного массива значений.
     *
     * @param   array   $params
     * @return  string
     */
    static public function values($values) 
    {
        return self::_wrap($values, ', ', self::WRAP_ASSIGNMENT);
    }

    /**
     * Формирует SQL-условие WHERE.
     *
     * @param   array   $params
     * @return  string
     */
    static private function _condition($params) 
    {
        return null === $params ? '' : '
               WHERE
                     ' . self::condition($params);
    }

    /**
     * Регистрирует ошибку БД.
     *
     * @param   string  $message
     * @param   boolean $internal
     */
    static private function _error($message, $code, $query = null) 
    {
        throw new Kernel_Db_Exception($message, $code, $query);
    }
}



abstract class database extends Kernel_Db { }



/**
 * Пространство имен для констант с кодами ошибок MySQL.
 *
 */
class MySQL 
{

    /**
     * Duplicate entry '%s' for key %d.
     *
     */
    const ER_DUP_ENTRY = 1062;
}
