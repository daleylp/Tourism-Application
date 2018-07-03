<?php

try{
    // Get the place and location
    $lat = urlencode($_POST["lat"]);
	$lng = urlencode($_POST["lng"]);
	
    // URL
    $BASE_URL = "https://api.sunrise-sunset.org/json";
    $param = "?lat=" . $lat . "&lng=" . $lng;
    $request = $BASE_URL . $param;
    // Initialise the connection for the given URL
    $ch = curl_init($request);
    
    // Configure the connection
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Make the request
    $response = curl_exec($ch);
    
	echo $response;
	
	curl_close($ch);
    
} 
catch (Exception $e){
    echo "Database connection error " . $e->getMessage();
}

?>