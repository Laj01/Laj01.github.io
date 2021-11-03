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
            maxZoom: 16,
            minZoom: 7,
            //projection: "EPSG:3857",
            extent: [1739604.2512535667, 5667622.243940988, 2659169.744533458, 6278642.820110521]
        }),        
        target: "js-map",
        keyboardEventTarget: document
    })

    //////////////////////////////////
    /////Base Layers/////////////////

    ////OSM//////////////////////////
    const openStreetMapLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),        
        visible: true,
        title: 'OSMTileLayer'        
    })

    ////Bing Maps///////////////////
    const bingMapsLayer = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'AooQSoNEEwyuUHIL2fBzcaO5K4thsxum0Y1feSzsc6SRJOJEI7uzHfVzVJZRPni_',
            imagerySet: 'AerialWithLabels'
        }),
        visible: false,
        title: 'BingTileLayer'
    })

    ////Stamen base layers/////////////
    const stamenMapLayer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'terrain',
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'            
        }),
        visible: false,
        title: 'StamenTileLayer'
    })

    ////Layer group////////////////////
    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapLayer,
            bingMapsLayer,
            stamenMapLayer
        ]
    })
    map.addLayer(baseLayerGroup)

    /////////////////////////////////////////
    ////Layer switcher logic for base layers
    const baseLayerElements = document.querySelectorAll('.navbar > .dropdown > .dropdown-content > .container > input[type=radio]')
    for (let baseLayerElement of baseLayerElements) {
        baseLayerElement.addEventListener('change', function(){
            let baseLayerElementValue = this.value;
            baseLayerGroup.getLayers().forEach(function(element){
                let baseLayerName = element.get('title');
                element.setVisible(baseLayerName === baseLayerElementValue)
            })
        })        
    }


    //Style for the sample data
    const sampleStyle = function(feature){
        //let sampleID = feature.get('ID');
        //let sampleIDString = sampleID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [219, 77, 105, 0.6]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [125, 6, 35, 1],
                        width: 2
                    }),
                    radius: 12
                }),
                /*text: new ol.style.Text({
                    //text: sampleIDString,
                    scale: 1,
                    fill: new ol.style.Fill({
                        color: [232, 26, 26, 1]
                    })
                }),*/
                stroke: new ol.style.Stroke({
                    color: [232, 26, 26, 1],
                    width: 0.3
                })
            })
        ]
        return styles
    }

    //Cross style for points
    const crossStyle = new ol.style.Style({
        image: new ol.style.RegularShape({
            fill: new ol.style.Fill({}),
            stroke: new ol.style.Stroke({                
                width:2
            }),
            points: 4,
            radius: 10,
            radius2: 0,
            angle: Math.PI / 4,
          })
    })

    //Style based on selected cities
    const sampleCityStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [0, 0, 0, 0]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 1],
                width: 3.5
            }),
            radius: 9
        })
    })  

    //Style based on selected depth
    const sampleDepthStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [0, 0, 0, 0]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 128, 0, 1],
                width: 3.5
            }),
            radius: 6
        })
    })

    //Style based on selected soil type
    const sampleSoilStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                //color: [0, 0, 0, 0]
            }),
            stroke: new ol.style.Stroke({
                //color: [255, 255, 0, 0.8],
                width: 4
            }),
            radius: 4
        })
    })

    /////INVISIBLE
    const invisibleStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [0, 0, 0, 0]
        })
    })

    //Style for Vas megye GeoJSON
    const vasStyle = new ol.style.Style({        
        stroke: new ol.style.Stroke({
            color: [0, 0, 255],
            width: 3,
        })
    })

    //Vas megye GeoJSON
    const vasLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/vector_data/vas.geojson'
        }),
        style: vasStyle        
    })
    map.addLayer(vasLayerGeoJSON);


    const allTheCheckboxes = document.querySelectorAll('.navbar > .dropdown > .dropdown-content > .container > input[type=checkbox]')
    let selectedSampleCityName;
    const styleSelector = function(feature){        
        let sampleCityName = feature.get('Helyseg');

        for(let allTheCheckbox of allTheCheckboxes){
            allTheCheckbox.addEventListener('change', function(){
                selectedSampleCityName = this.id;                               
            })
        }
        if(sampleCityName === selectedSampleCityName){
            feature.setStyle([sampleCityStyle])
        }
        if(sampleCityName === selectedSampleCityName){
            feature.setStyle([sampleDepthStyle])
        }
        if(sampleCityName === selectedSampleCityName){
            feature.setStyle([sampleSoilStyle])
        }
    }

    //Sample GeoJSON LAYER
    const sampleLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:23700'
            }),
            url: './data/vector_data/minta.geojson'
        }),
        visible: true,
        title: 'SampleData',
        style: sampleDepthStyle
    })

    map.addLayer(sampleLayerGeoJSON);

    /*//Function to get Coordinates from map
    map.on('click', function(e){
        console.log(e.coordinate)
    })*/

    ////Feature hover logic/////////
    /*const popoverTextElement = document.getElementById('popover-text');
    const popoverTextLayer = new ol.Overlay({
        element: popoverTextElement,
        positioning: 'bottom-center',
        stopEvent: false
    })
    map.addOverlay(popoverTextLayer);*/

    map.on('pointermove', function(evt){
        let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
        if(isFeatureAtPixel){
            //let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
            //let featureName = featureAtPixel[0].get('Tag');
            //popoverTextLayer.setPosition(evt.coordinate);
            //popoverTextElement.innerHTML = featureName;
            map.getViewport().style.cursor = 'pointer';
        }else{            
            //popoverTextLayer.setPosition(undefined);
            map.getViewport().style.cursor = '';
        }
    })


    ////Feature click
    const navElements = document.querySelectorAll('.dropdown-content > .container > input[type=checkbox]');
    const mapView = map.getView();

    map.on('singleclick', function(evt){
        map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){            
            displayFeatureInfo(feature);
            zoomToClickedFeature(feature);            

            /*let sampleLayerGeoJSONFeatures = sampleLayerGeoJSON.getSource().getFeatures(); //returns an array
            sampleLayerGeoJSONFeatures.forEach(function(feature){feature.setStyle(sampleDepthStyle)})
            feature.setStyle(sampleStyle)*/
        })
    })

    function displayFeatureInfo(feature){
        const cityNameElement = document.getElementById('cityname');
        const cityImageElement = document.getElementById('cityimage');
        const lightboxImageElement = document.getElementById('img2');        
        const sampleTagElement = document.getElementById('sampleTag');
        const sampleFractionElement = document.getElementById('sampleFraction');
        const sampleAreaElement = document.getElementById('sampleArea');
        const sampleDeptElement = document.getElementById('sampleDept');
        const sampleSoilElement = document.getElementById('sampleSoilType');
        const sampleDescriptionElement = document.getElementById('extendedInformation');
        const standardCityName = 'Válasszon mintát!';
        const standardCityImage = './data/static_images/description.png';
        const standardLightboxImage = `background-image: url('./data/static_images/description.png')`;
        const featureName = feature.get('Helyseg');
        const featureIMG = feature.get('Foto');
        
        if(featureName !== undefined){            
            cityImageElement.setAttribute('src', `./data/static_images/pics/${featureIMG}.jpg`);
            lightboxImageElement.setAttribute('style', `background-image: url('./data/static_images/pics/${featureIMG}.jpg')`);
            cityNameElement.innerHTML = `Település:  ${feature.get('Helyseg')}`;
            sampleTagElement.innerHTML = `Erdőtag: ${feature.get('Tag')}`;
            sampleFractionElement.innerHTML = `Erdőrészlet: ${feature.get('Reszlet')}`;
            sampleAreaElement.innerHTML = `Terület:  ${feature.get('Terulet')} ha`;
            sampleDeptElement.innerHTML = `Termőréteg mélység: ${feature.get('Melyseg')}`;
            sampleSoilElement.innerHTML = `Talajtípus: ${feature.get('Talajtipus')}`;
            sampleDescriptionElement.innerHTML = feature.get('Leiras');
            
        }else{
            cityNameElement.innerHTML = standardCityName;
            cityImageElement.setAttribute('src', standardCityImage);
            lightboxImageElement.setAttribute('style', standardLightboxImage);

        }        
    }    

    function zoomToClickedFeature(feature){
        let featureCoordinates = feature.get('geometry').getCoordinates();
        mapView.animate({center: featureCoordinates, duration: 1000}, {zoom: 14})
    }

    const selectInteraction = new ol.interaction.Select({
        condition: ol.events.condition.singleClick,
        style: sampleStyle
    })
    map.addInteraction(selectInteraction)

    /*OL SCALELINE*/
    const scaleLineControl = new ol.control.ScaleLine({bar: true});
    map.addControl(scaleLineControl);
}