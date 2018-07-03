
<?php

// https://stackoverflow.com/questions/19138772/php-google-geocode-with-curl-refusing-to-work
// http://www.blogtreat.com/get-latitude-longitude-address-using-php-google-map-api/
// https://www.dreamincode.net/forums/topic/306933-how-to-use-curl-in-php-for-json-results-from-google-places-api/page__st__15
// https://stackoverflow.com/questions/20714984/curl-request-to-google-places-api-returns-boolfalse

try{
    // Get the place and location
    $query = urlencode($_POST["query"]);
    $location = urlencode($_POST["location"]);
    
    // URL
    $BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    $param = "?query=" . $query . "&location=" . $location . "&radius=10000&key=<INSERT KEY HERE>";
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