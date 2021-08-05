<?php

error_reporting(-1);
ini_set('display_errors', 'On');

function dd($var) {
    echo('<pre>');
    var_dump($var);
    die;
}
