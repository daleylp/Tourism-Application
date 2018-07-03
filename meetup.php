<?php
    // https://secure.meetup.com/meetup_api/console/
    // https://www.meetup.com/meetup_api/?_cookie-check=3PZdK1EbXRFfxar2
    // https://api.meetup.com/find/groups?&sign=true&photo-host=public&country=new zealand&page=20&only=name, id&key=5b326b6e49555e1c4661c6f74523280
	// https://www.meetup.com/find/?allMeetups=false&keywords=Socially Active Hamilton
    try{

        // URL
        //$request = "https://api.meetup.com/find/groups?&sign=true&photo-host=public&country=new zealand&page=20&only=name, id&key=<INSERT KEY HERE>";
        $request = "https://api.meetup.com/find/groups?photo-host=public&page=20&country=new+zealand&sig_id=<INSERT KEY HERE>&only=name%2C+id&sig=<INSERT KEY HERE>";
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

