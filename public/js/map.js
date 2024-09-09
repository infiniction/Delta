
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates, //phle  logtitude fr latitude
        zoom: 9,
    });
    //to see marker
    console.log(coordinates);
    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h3>Welcome home</h3>"))
    .addTo(map);