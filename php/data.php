<?php
include('../db/db_connect.php');

$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);

    $data = $decoded['data'] ['itemdata'];
    $uuid = $decoded['data'] ['id'];

    $create_table = "CREATE TABLE IF NOT EXISTS mrt (id VARCHAR(255), item VARCHAR(255),dropzone VARCHAR(255), timevalue VARCHAR(255), activity VARCHAR(255))";
    $table_statement = $pdo->exec($create_table);

    foreach ($data as $value) {
        $sql = "INSERT INTO mrt (id, item, dropzone, timevalue, activity) VALUES ('{$uuid}','{$value['name']}','{$value['zone']}','{$value['timevalue']}','{$value['activity']}')";
        $stmt = $pdo->exec($sql);
    }

    //If json_decode failed, the JSON is invalid.
    if (is_array($decoded)) {
        $response = $decoded;
        header('Content-Type: application/json');
        echo json_encode($response);

    } else {
        echo('fehler');
    }
}
?>