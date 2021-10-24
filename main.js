'use strict';

window.onload = init();

function init(){


    //EPSG:3857 for BaseMap
    //proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
    //EPSG:23700 for Hungary
    proj4.defs("EPSG:23700","+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs");
    ol.proj.proj4.register(proj4);


    const map = new ol.Map({
        view: new ol.View({
            center: [1868579, 5974165],
            zoom: 9,
            maxZoom: 15,
            minZoom: 7,
            //projection: "EPSG:3857",
            extent: [1739604.2512535667, 5667622.243940988, 2659169.744533458, 6278642.820110521]
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "js-map",
        keyboardEventTarget: document
    })

    //Vas megye GeoJSON
    const vasLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/vector_data/vas.geojson'
        })
    })
    map.addLayer(vasLayerGeoJSON);

    //Minta GeoJSON
    const sampleLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:23700'
            }),
            url: './data/vector_data/minta.geojson'
        }),
        visible: true,
        title: 'SampleData'
    })
    map.addLayer(sampleLayerGeoJSON);

    //Function to get Coordinates from map
    map.on('click', function(e){
        console.log(e.coordinate)
    })
}