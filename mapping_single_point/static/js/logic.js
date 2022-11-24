console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [34.0522, -118.24],
    zoom: 11
});

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v11',
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

L.marker([34.1522, -118.2537]).addTo(map);
