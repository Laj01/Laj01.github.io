window.onload = init()

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [1868579, 5974165],
            zoom: 9,
            maxZoom: 15,
            minZoom: 7
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "js-map",
        keyboardEventTarget: document
    })
}