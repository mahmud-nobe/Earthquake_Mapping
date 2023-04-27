

// let satelliteStreet = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'satellite-v9',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: API_KEY
// });

let topograph = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
});

// let streetMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'streets-v11',
//     accessToken: API_KEY
// });

let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
});

// let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'dark-v11',
//     accessToken: API_KEY
// });

// var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
// 	maxZoom: 18,
// 	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
// });

var nightview = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});

let map = L.map('mapid', {
    center: [25, 10],
    zoom: 2,
    layers: [streetMap]
});

var baseMaps = {
    Street: streetMap,
    Topographic: topograph,
    Nightview: nightview
};

var earthquakeMap = new L.LayerGroup();
var tectonicPlate = new L.LayerGroup();
var majorEarthquake = new L.LayerGroup();

var OverlayMaps = {
    'Earthquake': earthquakeMap,
    'Tectonic Plates': tectonicPlate,
    'Major Earthquake': majorEarthquake
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
        return mag * 2.5;
    }
}

const colors = ['peachpuff', 'darksalmon', 'lightcoral', 'red', 'maroon', 'indigo', 'blue'];
function getColor(mag){
    if (mag >= 6){
        return colors[6];
    }
    else {
        ind = Math.floor(mag);
        return colors[ind];
    }
}

// Legend for magnitudes
const mag_range = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6+'];

let legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    for (var i=0; i<mag_range.length; i++){
        div.innerHTML += 
            "<i style='background: "+ colors[i] +"'></i>" + mag_range[i] + '<br>';
    }
    return div;
};

//legend.addTo(map);

// Add Earthquake Map
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

    //earthquakeMap.addTo(map);
})

// use only the major earthquakes
d3.json(earthquakeData).then( data => {
    major_data = data.features.filter(obj => obj.properties.mag > 4.5);
    console.log(major_data);
    L.geoJson(major_data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup('Magnitude: <b>' + feature.properties.mag + '</b><hr> Location: ' + feature.properties.place);
        },
        style: mapStyle
    }).addTo(majorEarthquake);

    //majorEarthquake.addTo(map);
})

// Add Tectonic Plates
tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(tectonicData).then( data => {
    L.geoJson(data, {
        color: 'orange',
        weight: 2,
    }).addTo(tectonicPlate);

    tectonicPlate.addTo(map);
})


// add or remove the legend depending on what overlay is displaying
map.on('overlayremove overlayadd', function(eventLayer){
    if (this.hasLayer(earthquakeMap) || this.hasLayer(majorEarthquake) ) {
        legend.addTo(this);
    } 
    else {
        this.removeControl(legend);
    }
});