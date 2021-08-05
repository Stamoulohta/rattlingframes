<?php

$upload = null;

if ( !isset($_POST['submit-button']) ) { die; }

const TARGET_DIR = 'data_new/';
const MAX_RES = 600;

function set_data($filename) {

    $data = sprintf("name : %s\nstreet: %s\narea: %s\nemotions: %s\ndate: %s \nVideo address: %s \nVideo file: %s",
        trim($_POST['name']),
        trim($_POST['street']),
        trim($_POST['area']),
        trim($_POST['emotions']),
        date('d-m-y'),
        trim($_POST['video_file']),
        trim($_FILES['uploaded_video']['name'])
    );
    file_put_contents(sprintf('%s%s.txt', TARGET_DIR, $filename), $data);

    $file = $_FILES['uploaded_video']['name'];
    $current = file_get_contents($_FILES['uploaded_video']['tmp_name']);
    file_put_contents( sprintf('%s%s', TARGET_DIR, $file), $current);

}

$filename = sprintf('%s_%s_%s', trim($_POST['street']), trim($_POST['area']), time());

try {
    set_data($filename);
    $upload = true;
}catch (Exception $e) {
    $upload = false;
}

switch (true) {
    case ($upload === true) :

        $to_email = "rattlingframes@gmail.com";
        $subject = "A new video has been uploaded to rattlingframes.net/data_new";
        $body = "A new user video has been uploaded: https://rattlingframes.net/data_new/";
        $headers = "From: video_upload@rattlingframes.net" . "\r\n";
        $headers .= 'Cc: minaidisk+rf@gmail.com, lascari.anna@gmail.com' . "\r\n";
    
        if ( mail($to_email, $subject, $body, $headers)) {
            // echo("Email successfully sent to $to_email...");
        } else {
            // echo("Email sending failed...");
        }
        echo 'thanks';
        break;

        case ($upload === false) :
        echo 'error';
        break;
}

die;
