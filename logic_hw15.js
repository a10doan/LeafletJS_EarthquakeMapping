var sfCoords = [37.7749, -122.4194];
var mapZoomLevel = 12;


var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYTEwZG9hbiIsImEiOiJjamZna3ExeW4zYzdkMnFvZm9wamtnazZwIn0.iiyb2QQD6Oo8BvYe0VmMHg", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
});



var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYTEwZG9hbiIsImEiOiJjamZna3ExeW4zYzdkMnFvZm9wamtnazZwIn0.iiyb2QQD6Oo8BvYe0VmMHg", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
});



var albertsMap = L.map("map-id", {
    center: sfCoords,
    zoom: 5,
    layers: [lightmap] //don't need 'lightmap.addto(albertsmap)//
});

//lightmap.addTo(albertsMap);

var urlInfo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var urlInfo2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";


d3.json(urlInfo, function(error, response) {
    if (error) {console.log(error); return (error);}
    console.log(response);
    console.log(response.features);
    console.log(response.features[0]);
    // createFeatures(response.features);
    console.log(response.features[0].properties.mag);

    // var quaketime = L.TimelineSliderControl(response.features,{});
    // console.log(quaketime);

    d3.json(urlInfo2, function (error, response2) {
        console.log(response2);
        createFeatures(response.features, response2.features);
    })
    
});

function getColor(d) {
    if (d < 2.3) {
        return ("#fff7bc");
    }
    else if (d < 4.5) {
        return ("#feb24f");
    }
    else {
        return ("#f03b20");
    }

}
function createFeatures(earthquakeData, faultLines) {
    var sliderControl = null;

    var earthquakeLayer = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, index) {
            return L.circleMarker(index, { radius: feature.properties.mag * 3.2,
            fillColor: getColor(feature.properties.mag), 
            color: "#000", weight: .4, fillOpacity: feature.properties.mag/6 }).bindPopup(feature.properties.place);
        }
    })

    var faultLineLayer = L.geoJSON(faultLines, {fillColor: "#fff7bc", color: "#000", weight: 1, fillOpacity: 0});
    console.log(earthquakeData[0].properties.time);

    var testlayer = L.geoJSON(earthquakeData),
        sliderControl = L.control.sliderControl({
            position: "bottomleft",
            layer: testlayer
        });
    //For a Range-Slider use the range property:
    sliderControl = L.control.sliderControl({
        position: "topright",
        layer: testlayer, 
        timeAttribute: "epoch",
        isEpoch: true,
        range: true
    });

    baseLayers = {
        "Light Map" : lightmap,
        "Dark Map": darkmap
    };
    overlayLayers = {
        Earthquakes: earthquakeLayer,
        Faultlines: faultLineLayer
    };

    L.control.layers(baseLayers, overlayLayers).addTo(albertsMap);
    albertsMap.addControl(sliderControl);
    sliderControl.startSlider();
}



