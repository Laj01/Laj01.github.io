'use strict';

window.onload = init();

function init(){
    

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
    
    ////// Base Layers //////
    // OSM Layer
    const openStreetMapLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMTileLayer'
    })

    // OSM Humanitarian
    const openStreetMapHumanitarianLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),        
        visible: false,
        title: 'OSMHumanitarianLayer'        
    })

    // Bing Maps Layer
    const bingMapsLayer = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'AooQSoNEEwyuUHIL2fBzcaO5K4thsxum0Y1feSzsc6SRJOJEI7uzHfVzVJZRPni_',
            imagerySet: 'AerialWithLabels'
        }),
        visible: false,
        title: 'BingTileLayer'
    })

    // Base Layer group
    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapLayer,
            openStreetMapHumanitarianLayer,
            bingMapsLayer            
        ]
    })
    map.addLayer(baseLayerGroup)
    
    // Layer switcher logic for baseLayerGroup
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

    ////// Vector styles //////
    // Style for selected vector feature on map
    const selectedSampleStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [219, 77, 105, 1]
            }),
            stroke: new ol.style.Stroke({
                color: [125, 6, 35, 1],
                width: 2
            }),
            radius: 12
        })
    })   
     

    // City style for point features
    const sampleCityStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [0, 0, 0, 0]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 1],
                width: 3
            }),
            radius: 9
        })
    }) 

    // Dept style for point features
    const sampleDepthStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [0, 0, 0, 0]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 128, 0, 1],
                width: 3
            }),
            radius: 6
        })
    })

    // Soil style for point features
    const sampleSoilStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                //color: [0, 0, 0, 0]
            }),
            stroke: new ol.style.Stroke({
                //color: [255, 255, 0, 0.8],
                width: 3
            }),
            radius: 3
        })
    })

    // Style for Vas megye GeoJSON
    const vasStyle = new ol.style.Style({        
        stroke: new ol.style.Stroke({
            color: [0, 0, 255],
            width: 3,
        })
    })

    // Vas megye GeoJSON
    const vasLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/vector_data/vas.geojson'
        }),
        style: vasStyle        
    })
    map.addLayer(vasLayerGeoJSON);

    
    // Sample GeoJSON LAYERS
    //city
    const cityLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:23700'
            }),
            url: './data/vector_data/minta.geojson'
        }),       
        visible: true,
        title: 'SampleData',
        style: null
    })

    //dept
    const deptLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:23700'
            }),
            url: './data/vector_data/minta.geojson'
        }),       
        visible: true, 
        title: 'SampleData',      
        style: null
    })    

    //soil
    const soilLayerGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:23700'
            }),
            url: './data/vector_data/minta.geojson'
        }),       
        visible: true,
        title: 'SampleData',   
        style: null
    })    

    const vectorLayerGroup = new ol.layer.Group({
        layers: [
            cityLayerGeoJSON,
            deptLayerGeoJSON,
            soilLayerGeoJSON            
        ]
    })
    map.addLayer(vectorLayerGroup)


    
    //*********************************************//
    //*3 különböző vector layer a minta geojsonból*//
    //*********************************************//
    let selectedCityRadioBtn;
    let selectedDepthRadioBtn;
    let selectedSoilRadioBtn; 

    ////////////CITY
    const cityStyleChangerLogic = function(feature){
        const selectedCity = feature.get('Helyseg');              
        if(selectedCityRadioBtn === selectedCity || selectedCityRadioBtn === 'Összes'){           
            return sampleCityStyle        
        }
    }

    const cityRadioBtns = document.querySelectorAll('.navbar > .dropdown > .dropdown-content-select-city > .container > input[type=radio]')
    for(let oneRadioBtn of cityRadioBtns){                
        oneRadioBtn.addEventListener('change', function(){                                           
            if(oneRadioBtn.checked){                  
                selectedCityRadioBtn = oneRadioBtn.value;                          
                cityLayerGeoJSON.setStyle(cityStyleChangerLogic);                                              
            }
        })        
    }

    ////////////Depth
    const depthStyleChangerLogic = function(feature){
        const selectedDepth = feature.get('Melyseg');              
        if(selectedDepthRadioBtn === selectedDepth){            
            return sampleDepthStyle        
        }
    }
    
    const depthRadioBtns = document.querySelectorAll('.navbar > .dropdown > .dropdown-content-select-depth > .container > input[type=radio]')
    for(let oneRadioBtn of depthRadioBtns){                
        oneRadioBtn.addEventListener('change', function(){                                           
            if(oneRadioBtn.checked){                  
                selectedDepthRadioBtn = oneRadioBtn.value;                          
                deptLayerGeoJSON.setStyle(depthStyleChangerLogic);                                              
            }
        })        
    }

    ////////////Soil
    const soilStyleChangerLogic = function(feature){
        const selectedSoil = feature.get('Talajtipus');              
        if(selectedSoilRadioBtn === selectedSoil){           
            return sampleSoilStyle        
        }
    }

    const soilRadioBtns = document.querySelectorAll('.navbar > .dropdown > .dropdown-content-select-soil > .container > input[type=radio]')
    for(let oneRadioBtn of soilRadioBtns){                
        oneRadioBtn.addEventListener('change', function(){                                           
            if(oneRadioBtn.checked){                  
                selectedSoilRadioBtn = oneRadioBtn.value;                          
                soilLayerGeoJSON.setStyle(soilStyleChangerLogic);                                              
            }
        })        
    }
    
    // Cursor style for feature detection on map
    map.on('pointermove', function(evt){
        let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
        if(isFeatureAtPixel){
            map.getViewport().style.cursor = 'pointer';
        }else{
            map.getViewport().style.cursor = '';
        }
    })

    //hdms
    map.on('click', function (evt) {
        const coordinateElement = document.getElementById('coordinate');
        const crdnt = evt.coordinate;
        const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(crdnt));
        coordinateElement.innerHTML = hdms;
    })

    // Feature click on MAP   
    const mapView = map.getView();

    map.on('singleclick', function(e){
        map.forEachFeatureAtPixel(e.pixel, function(feature){            
            try {
                displayFeatureInfo(feature);
                zoomToClickedFeature(feature);
            } catch (err) {
                console.log(`Error has occured: ${err}`)
            }          
        })
    })
   

    // Map interaction on selecting a feature
    const selectInteraction = new ol.interaction.Select({
        condition: ol.events.condition.singleClick,
        layers: function(layer){
            return layer.get('title') === 'SampleData';
        },
        style: selectedSampleStyle
    })
    map.addInteraction(selectInteraction)

    // Map animation on selecting a feature
    function zoomToClickedFeature(feature){        
            let featureCoordinates = feature.get('geometry').getCoordinates();            
            mapView.animate({center: featureCoordinates, duration: 1000}, {zoom: 14})
    }

    // Scale line control
    const scaleLineControl = new ol.control.ScaleLine({bar: true});
    map.addControl(scaleLineControl);

}