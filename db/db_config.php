<?php
switch ($_SERVER['SERVER_NAME']) {
    case 'localhost':
        $dbname = "lokaler_datenbankname";
        $host = "localhost";
        $user = "lokaler_username";
        $pw = "lokales password";
        break;

    case 'clemenskommerell.de':
        $dbname = "d02fca13";
        $host = "w0189a1e.kasserver.com";
        $user = "d02fca13";
        $pw = "ZJknQS5PsUQkdz2t";
        break;
}
?>