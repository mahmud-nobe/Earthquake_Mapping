

let streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'dark-v11',
    accessToken: API_KEY
});


let map = L.map('mapid', {
    center: [30,30],
    zoom: 2,
    layers: [dark]
});

var baseMaps = {
    Street: streetmap,
    Dark: dark
};

L.control.layers(baseMaps).addTo(map);


let airportData = 'https://raw.githubusercontent.com/mahmud-nobe/Earthquake_Mapping/main/mapping_different_features/static/data/majorAirports.json';

d3.json(airportData).then(function (data){
    L.geoJson(data, {
        onEachFeature: function (feature, layer){
            layer.bindPopup('Airport Code: <b>' + feature.properties.faa + '</b><hr>' + feature.properties.name);
        }
    }).addTo(map);
});
