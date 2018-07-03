// Global variables
var _map;
var _cities = new Array();
var _places = new Array();
var _markers = new Array();
var _selected;
var _currTime;
var _times;

// Initialises the map variable
function initMap(){
    _map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: -41.2865, lng: 174.7762},
    });
}



// Get the geocode for the given address and display on the map
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
function geocodeAddress(){
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value + " New Zealand";
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            _map.setZoom(11);
            _map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: _map,
                position: results[0].geometry.location
            });
            // Show the relevant divs
            document.getElementById("map").style.display = "block";
            document.getElementById("placeInput").style.display = "block";
            document.getElementById("cities").style.display = "block";
            document.getElementById("groupInput").style.display = "block";
            // Add to list
            if (isRecent(results[0].formatted_address) === false){
                var city = new City(results[0].formatted_address, marker.getPosition().lat(), marker.getPosition().lng());
                _cities.push(city.getThis());
            }
            _selected = results[0].formatted_address;
            _places = new Array();
            clear();
            document.getElementById('times').innerHTML = "";
            getTimes();
            deleteMarkers();
            document.getElementById('places').innerHTML = "";
        } 
        else alert('Geocode was not successful for the following reason: ' + status);
    });
}

// Set the marker and map position to specified lat/long location
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
function geocodeLatLng(latlng, selected){
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var latlngStr = latlng.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                _map.setZoom(11);
                _map.setCenter(latlng);
                var marker = new google.maps.Marker({
                position: latlng,
                map: _map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(_map, marker);
                // try getting the city from the object
                //_selected = results[0].formatted_address;*
                _selected = selected;
                _places = new Array();
                clear();
            	deleteMarkers();
            	document.getElementById('times').innerHTML = "";
            	getTimes();
            } 
            else window.alert('No results found');
        } 
        else window.alert('Geocoder failed due to: ' + status);
    });
}

// Set the marker and map position to specified lat/long location
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
function geocodeLatLngPlace(latlng){
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var latlngStr = latlng.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                _map.setZoom(11);
                _map.setCenter(latlng);
                var marker = new google.maps.Marker({
                position: latlng,
                map: _map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(_map, marker);
                clear();
            } 
            else window.alert('No results found');
        } 
        else window.alert('Geocoder failed due to: ' + status);
    });
}

	// Adding and removing markers more simply, taken from the google example
	// https://developers.google.com/maps/documentation/javascript/examples/marker-remove
	// Adds a marker to the map and push to the array.
      function addMarker(latlng) {
      	var latlngStr = latlng.split(',', 2);
    	var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        var marker = new google.maps.Marker({
          position: latlng,
          map: _map
        });
        _markers.push(marker);
      }

	// Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < _markers.length; i++) {
          _markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }
      



// Checks if the city is on the list of recently viewed
function isRecent(city){
    for (var i = 0; i < _cities.length; i++){
        if (_cities[i].getAddress() === city) return true;
    }
    return false;
}



// Check input is correct
function initCity(){
    var input = document.getElementById("address").value;
    if (input === null || input === ""){
        alert("Please enter a location in New Zealand");
        return;
    }
    geocodeAddress();
}

// Check input is correct
function initPlaces(){
    var input = document.getElementById("place").value;
    if (input === null || input === ""){
        alert("Please enter a place of interest in " + _selected);
        return;
    }
    getPlaces();
}


// Function to create a new town object
var City = function(address, lat, lng){

    // Variables for the data properties of a towns information
    var _address = address;
    var _latlng = lat + "," + lng;
    var _times;

    // An object literal representing the UI
    var _ui = {
        // Variables for the UI properties of the recently viewed list
        _container : null,
        _li : null,
        _text : null,
        _br : null,
    };

    // Create the DOM elements needed for the UI
    var _createUI = function(){
        // Create and initialise each of the UI elements and add them to the _ui object
        _ui._container = document.getElementById('recent');
        _ui._li = document.createElement("li");
        _ui._text = document.createTextNode(address);
        _ui._br = document.createElement("br");
        _ui._li.onclick = function(){
            geocodeLatLng.call(null, _latlng, _address);
        };
        _ui._li.appendChild(_ui._text);
        _ui._container.appendChild(_ui._li);
        _ui._container.appendChild(_ui._br);
    };

    // Getter methods for the town object

    this.getAddress = function(){
        return _address;
    }

    this.getLatLng = function(){
        return _latlng;
    }
    
    this.getTimes = function(){
        return _times;
    }
    
    this.getThis = function(){
        return this;
    }
    
    // Setter for the times
    this.setTimes = function(times){
        _times = times;
    }

    // Build the UI
    _createUI();
};



// Function to create a new place object
var Place = function(name, address, lat, lng){

    // Variables for the data properties of a places information
    var _name = name;
    var _address = address;
    var _latlng = lat + "," + lng;
    // An object literal representing the UI
    var _ui = {
        // Variables for the UI properties of the places list
        _container : null,
        _li : null,
        _text : null,
        _br : null,
    };

    // Create the DOM elements needed for the UI
    var _createUI = function(){
        // Create and initialise each of the UI elements and add them to the _ui object
        _ui._container = document.getElementById("places");
        _ui._li = document.createElement("li");
        _ui._text = document.createTextNode(name + ", " + address);
        _ui._br = document.createElement("br");
        _ui._li.onclick = function(){
            geocodeLatLngPlace.call(null, _latlng);
        };
        _ui._li.appendChild(_ui._text);
        _ui._container.appendChild(_ui._li);
        _ui._container.appendChild(_ui._br);
    };

    // Getter methods for the place object
    this.getName = function(){
        return _name;
    }

    this.getAddress = function(){
        return _address;
    }
    
    this.getLatLng = function(){
        return _latlng;
    }

    // Build the UI
    _createUI();
};

// Clear inputs and reset focus to the city textbox
function clear(){
    document.getElementById('address').value = "";
    document.getElementById('place').value = "";
    document.getElementById("address").focus();
}


// AJAX
var AjaxRequest = function(method, url, async, data, callback){

    var request = new XMLHttpRequest();
    
    request.open(method,url,async);

    if(method == "POST"){
        request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    }

    request.onreadystatechange = function(){
        if (request.readyState == 4) {
            if (request.status == 200) {
                var response = request.responseText;
                callback(response);
            } else {
                alert("Error: " + request.status);
            }
        }
    }
    request.send(data);
}



// Google places AJAX request
// Requests the places in an ajax/curl request and returns a json array
var getPlaces = function(){
    // Get the place
    var input = document.getElementById("place").value;
    var location = null;
    // Get the lat/long of the city
    for (var i = 0; i < _cities.length; i++){
        if (_cities[i].getAddress() === _selected){
            location = _cities[i].getLatLng();
        }
    }
    
    var data = "input=" + input + "&location=" + location;
    AjaxRequest("POST", "places.php", true, data, getPlacesCallback);
}

// Store the places in an array
var getPlacesCallback = function(response){
    // Store the data
    var data = JSON.parse(response);
    var data = data.results
    for (var i = 1; i < data.length; i++){
        var place = new Place(data[i].name, data[i].vicinity, data[i].geometry.location.lat, data[i].geometry.location.lng);
        _places.push(place);
        addMarker(place.getLatLng());
    }
}



// Meetup groups AJAX request
// Requests the groups in an ajax/curl request and returns a json array
var getGroups = function(){
    AjaxRequest("POST", "meetup.php", true, "", getGroupsCallback);
}

// Display the groups
var getGroupsCallback = function(response){
    // Store the data
    var data = JSON.parse(response);
    for (var i = 1; i < data.length; i++){
        // Display the times
	   	var container = document.getElementById("groupsDiv");
	    
	    // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_anchor_create
	    var p = document.createElement("p");
	    var a = document.createElement("A");
	    var t = document.createTextNode(data[i].name);
	    a.setAttribute("href", "https://www.meetup.com/find/?allMeetups=false&keywords=" + data[i].name);
	    a.appendChild(t);
	    p.appendChild(a);
	    container.appendChild(p);
    }
}



// Sunrise sunset AJAX request
// Requests the times in an ajax/curl request and returns a json array
var getTimes = function(){
    var lat = null;
    var lng = null;
    
    // Get the lat/long of the city
    for (var i = 0; i < _cities.length; i++){
        if (_cities[i].getAddress() === _selected){
            var location = _cities[i].getLatLng();
            var latlngStr = location.split(',', 2);
            lat = latlngStr[0];
            lng = latlngStr[1];
        }
    }
    //location is correct
    var data = "lat=" + lat + "&lng=" + lng;
    AjaxRequest("POST", "sunrise.php", true, data, getTimesCallback);
}

// Store the places in an array
var getTimesCallback = function(response){// https://developers.google.com/maps/documentation/javascript/examples/marker-remove
	
    // Parse the data
    var data = JSON.parse(response);
    // Swap the labels
    var sunrise = data.results.sunrise;
    var timeStr = sunrise.split(' ', 2);
    sunrise = timeStr[0];
    var sunset = data.results.sunset;
    timeStr = sunset.split(' ', 2);
    sunset = timeStr[0];
    data = "Sunrise: " + sunrise + " AM" + " Sunset: " + sunset + " PM";
    // Display the times
   	var container = document.getElementById("times");
    var span = document.createElement("span");
    var text = document.createTextNode(data);
    span.appendChild(text);
    container.appendChild(span);
    
    // Store the times for later
    for (var i = 0; i < _cities.length; i++){
        if (_cities[i].getAddress() === _selected){
            _cities[i].setTimes(data);
        }
    }
    _times = data;
}