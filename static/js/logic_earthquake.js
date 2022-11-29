

let satelliteStreet = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let streetMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'streets-v11',
    accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'dark-v11',
    accessToken: API_KEY
});


let map = L.map('mapid', {
    center: [44,-80],
    zoom: 2,
    layers: [streetMap]
});

var baseMaps = {
    Street: streetMap,
    Satellite: satelliteStreet,
    Dark: dark
};

var earthquakeMap = new L.LayerGroup()

var OverlayMaps = {
    Earthquake: earthquakeMap
}

L.control.layers(baseMaps, OverlayMaps).addTo(map);


function mapStyle(feature) {
    return {
        color: "black",
        weight: 2,
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 1,
        opacity: 0.5
    };
}

function getRadius(mag){
    if (mag === 0){
        return 1;
    }
    else {
        return mag * 3;
    }
}

function getColor(mag){
    var colors = ['peachpuff', 'darksalmon', 'lightcoral', 'red', 'maroon', 'indigo'];
    if (mag >= 5){
        return colors[5];
    }
    else {
        ind = Math.floor(mag);
        console.log(mag, ind)
        return colors[ind];
    }
}

var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeData).then( data => {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup('Magnitude: <b>' + feature.properties.mag + '</b><hr> Location: ' + feature.properties.place);
        },
        style: mapStyle
    }).addTo(earthquakeMap);

    earthquakeMap.addTo(map);
})
