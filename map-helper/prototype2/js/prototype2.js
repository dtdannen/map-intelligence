function initializeMap() {
	var map = createMap("map-canvas");
	var bounds = emptyBounds();
	var googleSearch = createGoogleSearch("google-search", map);

	fitBounds(map, bounds);
}

addDomListener(window, 'load', initializeMap);
