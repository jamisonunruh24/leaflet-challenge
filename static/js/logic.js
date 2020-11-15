var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url, function(response){
    console.log(response)
    var data = response.features;
    var mag = []     // data.properties.mag
    var depth = []   //data.geometry.coordinates[2]
    var lat = []     //data.geometry.coordinates[1]
    var long = []    //data.geometry.coordinates[0]
    var place = []   // data.properties.place
    var time = []    // data.properties.time

    console.log(data)

    data.forEach(function(data){
            mag.push(data.properties.mag)
            depth.push(data.geometry.coordinates[2]);
            lat.push(data.geometry.coordinates[1]);
            long.push(data.geometry.coordinates[0]);
            place.push(data.properties.place);
            time.push(data.properties.time)
    })

    console.log(mag)
    console.log(depth)
    console.log(place)
    console.log(time)

    function getColor(d) {
        return d > 90  ? '#FA0303'  :
               d > 70  ? '#FA7703'  :
               d > 50  ? '#FAA703'  :
               d > 30  ? '#FAEE03'  :
               d > 10  ? '#9AFA03'  :
               d > -10 ? '#4BFA03'  :
                         '#FFFFFF';
    }


    
    var myMap = L.map("mapid", {
        center: [39.8283, -115], // long: -179.6738 - 173.315  Lat: -62.3657 - 78.4707
        zoom: 5
    }); 
    
    
            // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
     }).addTo(myMap);

    for (var i = 0; i < data.length; i++) {
        //Converting time found on https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
        var utcSeconds = time[i]
        var d = new Date(0);
        d.setUTCMilliseconds(utcSeconds)
        L.circle([lat[i], long[i]], {
            color: "black",
            weight: .5,
            fillColor: getColor(depth[i]),
            fillOpacity: .5,
            radius: mag[i] * 10000
        })
        .bindPopup("<h3>" + place[i] + "</h3> <hr> <h3> Time " + d + "</h3>")
        .addTo(myMap);
    }

    //Legend came from https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];
    
        // from example on site legend was offset, added a second <br> to align
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br><br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);


});