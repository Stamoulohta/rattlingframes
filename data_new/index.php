<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>View Rattling Frames</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<body>

<div>
    <h2>Uploaded Videos</h2>
    <hr/>
    <ul>
    <?php

    function ends_with($haystack, $needle) {
        return substr_compare($haystack, $needle, -strlen($needle)) === 0;
    }

    function scan_dir($dir) {
        $ignored = array('.', '..', '.svn', '.htaccess');

        $files = [];    
        foreach (scandir($dir) as $file) {

            if( ends_with($file, '.php')) continue;
            if( $file == "." ) continue;
            if( $file == ".DS_Store" ) continue;
            if( $file == ".." ) continue;
            // if(! ends_with($file, 'mp4')) continue;
            $files[$file] = filemtime("{$dir}/{$file}");
        }

        arsort($files);

        return array_keys(array_reverse($files));
    }

    foreach(scan_dir('./') as $file) {

        
        echo '<li>';

        if ( 
            ends_with( $file, ".mp4") || 
            ends_with( $file, ".webm") || 
            ends_with( $file, ".avi") || 
            ends_with( $file, ".mov") || 
            ends_with( $file, ".mpg") || 
            ends_with( $file, ".mpeg") || 
            ends_with( $file, ".3gp") 
        ){

            printf('<a target="_blank" href="./%s"><strong>%s</strong></a>', $file, $file);

        } else {

            printf('Details: <strong>%s</strong>', $file);

        }

        if ( ends_with( $file, ".txt") ){
            $filecontents = file_get_contents( $file );
            echo '<pre>';
            printf( $filecontents );
            echo '</pre>';
        }

        echo '</li>';
    }

    ?>
    </ul>
</div>
</body>
</html>
