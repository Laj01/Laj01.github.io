window.onload = init()

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [1883866, 5983567],
            zoom: 8,
            maxZoom: 15,
            minZoom: 7
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "js-map"
    })
}