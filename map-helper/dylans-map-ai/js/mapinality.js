
function addMapLoadListener() {
	google.maps.event.addDomListener(window, 'load', initMap);
}
function initMap() {

	var markers = [];
	var map;
	var bounds;
	var currentPlaces = [];
	var service;
	var infoWindow;
	var mapOptions;
	var googleSearchBox;
	var divsAndPlaceIds = {}

	function getAdditionalInfo(pid) {

		function showReviewsDataInModal(reviewObjects, name) {

			$("#modal-place-name").html(name);

			reviewObjects.forEach(function(ro) {
				var reviewDiv = document.createElement("div");
				reviewDiv.className = "modal-review-div";

				reviewDiv.innerHTML += "<h3 class='text-center'>By: " + ro.author_name + "</h3>";
				reviewDiv.innerHTML += "<h3>Rating: " + ro.rating + "</h3>";
				reviewDiv.innerHTML += "<h3>FeedBack: " + ro.text + "</h3>";
				reviewDiv.innerHTML +="<h3>Posted @: " + new Date(ro.time).toString() + "</h3>";

				$("#review-modal-scroll").append(reviewDiv);

			})

			$("#review-modal").modal();
		}
		var request = {
			placeId: pid
		}

		var currentDiv = divsAndPlaceIds[pid];

		service.getDetails(request, function(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {

				console.log(place);

				if (place.hasOwnProperty("international_phone_number"))
					currentDiv.innerHTML += ("<p class='place-div-para'>International Phone Number: " + place.international_phone_number + "</p>");
				
				if (place.hasOwnProperty("price_level"))
					currentDiv.innerHTML += ("<p class='place-div-para'>Price Level: " + place.price_level + "</p>");
				
				if (place.hasOwnProperty("rating"))
					currentDiv.innerHTML += ("<p class='place-div-para'>Rating: " + place.rating + "</p>");

				if (place.hasOwnProperty("formatted_phone_number"))
					currentDiv.innerHTML += ("<p class='place-div-para'>Phone Number: " + place.formatted_phone_number + "</p>");

				if (place.hasOwnProperty("reviews")) {
	
					var reviewObjects = place.reviews;

					if (reviewObjects.length > 0) {

						var reviewLink = document.createElement("a");
						reviewLink.className = "place-div-link";
						reviewLink.innerText = "See Reviews";
						reviewLink.onclick = function() { showReviewsDataInModal(reviewObjects, place.name) };

						$(currentDiv).append(reviewLink);
					}

				}

			}
			else {
				
			}
		})
	}

	function makeNewDivElement(place) {
		var div = document.createElement("div");
		div.id = place.place_id;

		divsAndPlaceIds["divid".replace("divid", div.id)] = div;

		getAdditionalInfo(div.id);

		console.log(place);
		console.log(divsAndPlaceIds[div.id]);

		if (place.hasOwnProperty("formatted_address"))
			div.innerHTML += ("<p class='place-div-para'> Address: " + place.formatted_address + "</p>");

		if (place.hasOwnProperty("name"))
			div.innerHTML += ("<p class='place-div-para'> Name: " + place.name + "</p>");

		if (place.hasOwnProperty("opening_hours")) {
			var openHoursObject = place.opening_hours;
			if (openHoursObject.hasOwnProperty("open_now"))
				div.innerHTML += ("<p class='place-div-para'> Open Now: " + openHoursObject.open_now + "</p>");
		}


		return div;
	}
	function addPlaceToView(place) {
		var newPlaceDiv = makeNewDivElement(place);
		$("#places-box").append(newPlaceDiv);
	}

	function createMarker(place) {
		var marker = new google.maps.Marker({
			map: map,
			title: place.name,
			position: place.geometry.location
		});

		markers.push(marker);

		google.maps.event.addListener(marker, 'click', function() {
	    	infowindow.setContent(place.name);
	    	infowindow.open(map, this);
  		});
	}
	function resetPlaces() {
		currentPlaces = [];
		$("#places-box").empty();
	}

	function handlePlace(place) {
		
		createMarker(place);
		addPlaceToView(place);
		bounds.extend(place.geometry.location);
	}

	function resetMarkers() {
		for (var i = 0, marker; marker=markers[i]; i++) {
			marker.setMap(null);
		}
		markers = [];
	}
	function showNumberOfResults(numResults) {
		if (numResults == 1)
			$("#number-of-results").html("There is x Result".replace('x', numResults));
		else
			$("#number-of-results").html("There are x Results".replace('x', numResults));
	}
	function searchFunction() {
		var places = googleSearchBox.getPlaces();
		if (places.length == 0)
			return

		showNumberOfResults(places.length);
		resetPlaces();
		resetMarkers();

		bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place=places[i]; i++) {
			handlePlace(place);
		}
		map.fitBounds(bounds);
	}
	function setBounds() {
		bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(-33.8902, 151.1759),
			new google.maps.LatLng(-33.8474, 151.2631)
		)
		map.fitBounds(bounds);
	}
	function createMapOptions() {
		mapOptions = {};
	}
	function setupGoogleSearch() {
		var inputSearch = document.getElementById("search");
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSearch);
		googleSearchBox = new google.maps.places.SearchBox(inputSearch);		
	}
	function createMap() {
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		service = new google.maps.places.PlacesService(map);
	}
	function boundsChangedCallBack() {
		bounds = map.getBounds();
		googleSearchBox.setBounds(bounds);
	}
	function tilesLoadedCallBack() {
		if (document.getElementById("search").style.display != "")
			$("#search").show();
	}
	function addMapListeners() {
		google.maps.event.addListener(map, 'bounds_changed', boundsChangedCallBack);
		google.maps.event.addListener(map, 'tilesloaded', tilesLoadedCallBack);
		google.maps.event.addListener(googleSearchBox, 'places_changed', searchFunction);
	}

	createMapOptions();
	createMap();
	setupGoogleSearch();
	addMapListeners();
	setBounds();
	
}

addMapLoadListener();



