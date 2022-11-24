console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [37.6214, -122.3790],
    zoom: 5
});

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);

L.circle([34.0522, -118.2437], {
    radius: 1000,
    color: 'white',
    fillColor: 'yellow'
 }).addTo(map);

// L.marker([34.1522, -118.2537]).addTo(map);

// An array containing each city's location, state, and population.
let cityData = cities;

  // Loop through the cities array and create one marker for each city.
cityData.forEach(function(city) {
    console.log(city);
    L.circle(city.location, {
        radius: city.population/40,
        fillColor: 'yellow',
        color: 'white',
        fillOpacity: 0.9
    })
    .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
    .addTo(map);
});

let line = [
    [33.9416, -118.4085],
    [37.6214, -122.3790],
    [40.7899, -111.9791],
    [47.4502, -122.3088]
  ];

// Create a polyline using the line coordinates and make the line red.
L.polyline(line, {
    color: "yellow"
  }).addTo(map);