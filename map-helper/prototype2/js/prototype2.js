function initializeMap() {

	$("#map-data-table").hide();

	var map = createMap("map-canvas");
	var bounds = emptyBounds();
	var googleSearch = createGoogleSearch("google-search", map);
	var service = createPlacesService(map);
	var currentLatLngFrom;

	fitBounds(map, bounds);
	addMapListener(googleSearch, 'places_changed', searchFunction)




	function searchFunction() {
		var places = googleSearch.getPlaces();
		console.log("places recieved");
		console.log(places);
		if (places.length == 1) {
			currentLatLngFrom = places[0].geometry.location;
			$("#map-data-table").show();
			$("#start_loc").html(places[0].formatted_address)
			nearbySearchRadius(places[0], nearbySearchCallBack, service);
		}
	}


	function nearbySearchCallBack(results, status, pagination) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
    		for (var i = 0; i < results.length; i++) {
    			console.log(results[i]);
      			var table_body = document.getElementById("map-data-table-body");
      			table_body.innerHTML += replace("<tr><td>name</td>", "name",results[i].name) + replace("<td>distance</td></tr>", "distance",computeDistance(currentLatLngFrom, results[i].geometry.location));

    		}
    		if (pagination.hasNextPage)
    			pagination.nextPage();
  		}
	}
}

addDomListener(window, 'load', initializeMap);
