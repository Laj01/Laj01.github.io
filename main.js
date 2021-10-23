'use strict';

window.onload = init();

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [1868579, 5974165],
            zoom: 9,
            maxZoom: 15,
            minZoom: 7,
            extent: [1739604.2512535667, 5667622.243940988, 2659169.744533458, 6278642.820110521]
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
                //[minX, minY, maxX, maxY]
                //extent: [1739604.2512535667, 5667622.243940988, 2659169.744533458, 6278642.820110521]
            })
        ],
        target: "js-map",
        keyboardEventTarget: document
    })

    //Vas megye GeoJson
    const vasMegyeLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/vector_data/vas.geojson'
        })
    })

    map.addLayer(vasMegyeLayer);

    //Function to get Coordinates from map
    map.on('click', function(e){
        console.log(e.coordinate)
    })
}