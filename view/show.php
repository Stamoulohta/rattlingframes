<!DOCTYPE html>

<html lang="el">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>View Frames</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>

<body style="background-color: #444444;">

<div style="width: 600px; margin: auto;">
    <video style="background-color: black;" width="600" height="600" controls>
        <?php printf('<source src="%s" type="video/mp4">', $_GET['video']); ?>
    </video>
</div>

<div style="width: 600px; margin: auto;">
    <ul style="color:#dddddd">
        <?php
        foreach (file($_GET['text']) as $line) {
            echo("<li>$line</li>");
        }
        ?>
    </ul>
    <a style="text-align: center;" href="index.php"><h3>Πίσω</h3></a>
</div>
</body>
</html>