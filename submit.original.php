<?php
require('vendor/autoload.php');

use FFMpeg\Coordinate\Dimension;
use FFMpeg\FFMpeg;
use FFMpeg\FFProbe;
use FFMpeg\Format\Video\X264;

const TARGET_DIR = 'data/';
const MAX_RES = 600;

function get_dimensions() {
    $stream = FFProbe::create([
    'ffmpeg.binaries'  => '/usr/bin/ffmpeg',
    'ffprobe.binaries' => '/usr/bin/ffprobe',
    ])
    ->streams($_FILES['video_file']['tmp_name'])
    ->videos()
    ->first();

    $portrait = false;
    if($stream->has('tags')) {
        $tags = $stream->get('tags');
        if(isset($tags['rotate'])) {
            $portrait = in_array($tags['rotate'], ['90', '-90', '270', '-270']);
        }
    }

    $dimension = $stream->getDimensions();

    return $portrait ? [$dimension->getHeight(), $dimension->getWidth()] : [$dimension->getWidth(), $dimension->getHeight()];
}

function get_scale() {
    $dim = get_dimensions();

    if($dim[0] > $dim[1]) {
        if($dim[0] <= MAX_RES) {
            return $dim;
        }
        $height = $dim[1] / ($dim[0] / MAX_RES);
        $height = $height % 2 == 0 ? $height : --$height;
        return [MAX_RES, $height];

    }else{
        if($dim[1] <= MAX_RES) {
            return $dim;
        }
        $width = $dim[0] / ($dim[1] / MAX_RES);
        $width = $width % 2 == 0 ? $width : --$width;
        return [$width, MAX_RES];
    }
}

function set_data($filename) {
    $data = sprintf("name : %s\nstreet: %s\narea: %s\nemotions: %s\ndate: %s",
        trim($_POST['name']),
        trim($_POST['street']),
        trim($_POST['area']),
        trim($_POST['emotions']),
        date('d-m-y'));
    file_put_contents(sprintf('%s%s.txt', TARGET_DIR, $filename), $data);
}

$filename = sprintf('%s_%s_%s', trim($_POST['street']), trim($_POST['area']), time());

$ffmpeg = FFMpeg::create([
    'ffmpeg.binaries'  => '/usr/bin/ffmpeg',
    'ffprobe.binaries' => '/usr/bin/ffprobe',
    'timeout'          => 3600,
    'ffmpeg.threads'   => 12,
]);
$video = $ffmpeg->open($_FILES['video_file']['tmp_name']);

$video->filters()->resize(new Dimension(...get_scale()))->synchronize();

try {
    $video->save(new X264('libmp3lame'), sprintf('%s%s.mp4', TARGET_DIR, $filename));
    set_data($filename);
    $upload = true;
}catch (Exception $e) {
    $upload = false;
}
