<?php
//Verzeichnis der Bilder auswählen und einlesen
define('DIR_ICONS', 'images/icons/');

$pathScandir = '../' . DIR_ICONS;
$allIcons = scandir($pathScandir);
$iconList = array();

//schleife liest für jedes Element des Ordners die Eigenschaften aus und stellt das Element als Image mit id=Dateiname dar.
foreach ($allIcons as $icon) {
    $isIcon = $icon !== "." && $icon !== ".." && strpos($icon, '.png') !== false;

    if ($isIcon) {
        $iconList[] = array(
            'name' => $icon,
            'path' => DIR_ICONS. $icon
        );
    };
};

header('Content-Type: application/json; charset=utf-8');
echo json_encode($iconList);
