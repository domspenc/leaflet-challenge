// Store the API endpoint as an object called 'url'.
let url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function(data){
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create a function to run for each specified feature within the features array
function createFeatures(earthquakeData){
  // Within this function, create a popup function for each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      `<h3>Location: ` +
        feature.properties.place +
        `</h3><hr>
        <p> Magnitude: ` +
        feature.properties.mag +
        `</p><hr>
        <p> Date: ` +
        new Date(feature.properties.time) +
        `</p>`
    );
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  });

  createMap(earthquakes);
}

// Create a function for the map attributes
function createMap(earthquakes){
  // Create the base layers.
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  //Create an map object for the base layers
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [14.69, 120.97],
    zoom: 5,
    layers: [street, earthquakes],
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}