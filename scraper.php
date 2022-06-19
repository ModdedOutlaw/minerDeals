<?php

$api_url = 'https://tools.uplift.art:3033/v1/world/info/pools';
$json_data = file_get_contents($api_url);
$response_data = json_decode($json_data);
$json = json_encode(array('data' => $response_data));

//write json to file
if (file_put_contents("pools.json", $json, JSON_PRETTY_PRINT))
  echo "Pool informations recieved...<br>";
else
  echo "Oops! Error creating json file...";

?>