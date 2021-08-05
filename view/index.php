<!DOCTYPE html>
<!-- vim: set expandtab ts=4 tw=4 sw=4: -->

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>View Rattling Frames</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<body>

<div>
    <ol>
    <?php

    function ends_with($haystack, $needle) {
        return substr_compare($haystack, $needle, -strlen($needle)) === 0;
    }

    function scan_dir($dir) {
        $ignored = array('.', '..', '.svn', '.htaccess');

        $files = [];    
            foreach (scandir($dir) as $file) {
            if(! ends_with($file, 'mp4')) continue;
            $files[$file] = filemtime("{$dir}/{$file}");
        }

        arsort($files);

        return array_keys(array_reverse($files));
    }

    foreach(scan_dir('../data') as $file) {

        printf('<li><a href="show.php?video=../data/%s&text=../data/%s">%s</a></li>',
            $file,
            substr_replace($file, '.txt', -4),
            substr($file, 0, -15));
    }

    ?>
    </ol>
</div>
</body>
</html>
