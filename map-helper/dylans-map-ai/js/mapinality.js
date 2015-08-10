
function initMap() {
	var markers = [];
	var map;
	var bounds;
	var currentPlaces = [];

	function makeNewDivElement(placeObject) {
		var div = document.createElement("div");
		div.id = placeObject.place_id;
		div.innerHTML += ("<p>" + placeObject.formatted_address + "</p>");
		div.innerHTML += ("<p>" + placeObject.name + "</p>");

		return div;
	}

	function resetMarkers() {
		console.log("markers are currently ");
		console.log(markers);
		console.log("resetting markers");
		for (var i = 0, marker; marker=markers[i]; i++) {
			marker.setMap(null);
		}
	}
	function handlePlace(place) {
		console.log(place);
		var image = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
		};

		var marker = new google.maps.Marker({
			map: map,
			title: place.name,
			position: place.geometry.location
		});
		
		var newPlaceDiv = makeNewDivElement(place);
		$("#places-box").append(newPlaceDiv);

		markers.push(marker);
		bounds.extend(place.geometry.location);
	}
	function resetPlaces() {
		currentPlaces = [];
		$("#places-box").empty();
	}
	function searchFunction() {
		var places = googleSearchBox.getPlaces();
		if (places.length == 0)
			return

		resetPlaces();
		resetMarkers();
		markers = [];

		bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place=places[i]; i++) {
			handlePlace(place);
		}
		map.fitBounds(bounds);
	}

	var mapOptions = {
					
	}

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(-33.8902, 151.1759),
		new google.maps.LatLng(-33.8474, 151.2631)
	)
	map.fitBounds(bounds);

	var inputSearch = document.getElementById("search");
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSearch);
	var googleSearchBox = new google.maps.places.SearchBox(inputSearch);
				
	google.maps.event.addListener(googleSearchBox, 'places_changed', searchFunction);
	google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		googleSearchBox.setBounds(bounds);
	})


}
google.maps.event.addDomListener(window, 'load', initMap);

