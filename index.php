<?php

//include_once('debug.php');

$upload = null;
$page = null;

if (isset($_POST['submit-button'])) {
    require('submit.php');
}

if (isset($_GET['ajax']) && $_GET['ajax'] == '1') {
    echo(json_encode(compact('upload')));
    die;
}

if ( $upload === null ){
    require("map.html");
    die;
}

switch (true) {
    case ($upload === true) :
        $page = 'thanks';
        break;
    case ($upload === false) :
        $page = 'error';
        break;
    // case ($upload === null) :
    //     $page = 'call';
}

if (isset($_GET['lan'])) {
    require(sprintf('%s-%s.html', $page, $_GET['lan']));
    die;
}

require("$page-el.html");

