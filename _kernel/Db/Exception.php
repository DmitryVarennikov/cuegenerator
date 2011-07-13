<?php

/**
 * Исключение, представляющее ошибку при работе с БД.
 *
 */
class Kernel_Db_Exception extends Exception {

    /**
     * Запрос, выполнение которого вызавало обшибку.
     *
     * @var string
     */
    private $query;

    /**
     * Конструктор.
     *
     * @param   string  $message
     * @param   integer $code
     * @param   string  $query
     */
    public function __construct($message, $code = 0, $query = null) {
        parent::__construct($message, $code);
        $this->query = $query;
    }

    /**
     * Возвращает, произошла ли ошибка во время выполнения запроса.
     *
     * @return  boolean
     */
    public function isRuntime() {
        return null !== $this->query;
    }

    /**
     * Возвращает контекст, в котором произошла ошибка.
     *
     * @return  string
     */
    public function getContext() {
        $trace = $this->getTrace();
        return array_extract($trace[2], array('file', 'line')) + array('query' => $this->query);
    }
}
