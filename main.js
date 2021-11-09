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

    
    //// Base Layers
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

    //StamenTile layer
    const stamenMapLayer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'terrain',
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'            
        }),
        visible: false,
        title: 'StamenTileLayer'
    })

    // Layer group
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

    //// Vector styles
    // Style for selected vector feature on map
    const sampleStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [219, 77, 105, 0.6]
            }),
            stroke: new ol.style.Stroke({
                color: [125, 6, 35, 1],
                width: 2
            }),
            radius: 12
        })
    })

    // Cross style point features
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

    const deleteCityStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0]
            }),
            stroke: new ol.style.Stroke({
                color: [0, 0, 0, 1],
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

    // Invisible style for point features
    const invisibleStyle1 = new ol.style.Style({
        image: new ol.style.Circle({})
    })

    // Invisible style for point features
    const invisibleStyle2 = new ol.style.Style({
        image: new ol.style.Circle({})
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

    
    // Sample GeoJSON LAYER
    const sampleLayerGeoJSON = new ol.layer.Vector({
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
    map.addLayer(sampleLayerGeoJSON);   
    

    ///////////////////////////////////////////
    //// Style function for smaple vector layer 
    ///////////////////////////////////////////    
    let selectedCheckbox;
    let isFeatureVisible;
    let styleArray = [];
    let uniquePlus = [];  
    let uniqueMinus = [];  
    function uniqueArray(data){ return data.filter((value, index) => data.indexOf(value) === index)}  
    function removeElementFromuniqueArray(arr, value) {
        let index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
      }

    const styleChangerLogic = function(feature){
        const selectedCity = feature.get('Helyseg');
        const selectedDepth = feature.get('Melyseg')
        const selectedSoil = feature.get('Talajtipus')       
        if(selectedCheckbox === selectedCity || selectedCheckbox === 'Összes'){            
            //feature.setStyle(sampleCityStyle);
            return sampleCityStyle
        }else if(selectedCheckbox === selectedDepth){
            //feature.setStyle(sampleDepthStyle);
            return sampleDepthStyle
        }else if(selectedCheckbox === selectedSoil){
            //feature.setStyle(sampleSoilStyle);
            return sampleSoilStyle
        }
    }

    const soilChangerLogic = function(feature){        
        selectedSoil = feature.get('Talajtipus');
        if(selectedCheckbox === selectedSoil){
            //feature.setStyle(sampleSoilStyle)
            return sampleSoilStyle
        }           
    }

    const styleDeleterLogic = function(feature){ 
        const vectorFeature =  sampleLayerGeoJSON.getSource().getFeatures()
        console.log(vectorFeature)    
        /*if(selectedCheckbox === selectedCity){
            console.log('vectorFeature')
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({})
            }));        
        } */           
    }


    const allTheCheckboxes = document.querySelectorAll('.navbar > .dropdown > .dropdown-content-select > .container > input[type=radio]')
    for(let oneCheckbox of allTheCheckboxes){                
        oneCheckbox.addEventListener('change', function(){ 
                                           
            if(oneCheckbox.checked){                  
                selectedCheckbox = oneCheckbox.value;
                /*               
                styleArray.push(selectedCheckbox)
                uniquePlus = uniqueArray(styleArray)
                */               
                sampleLayerGeoJSON.setStyle(styleChangerLogic);                                              
            }else{
                //selectedCheckbox = oneCheckbox.id;                
                /*
                uniqueMinus = removeElementFromuniqueArray(uniquePlus, selectedCheckbox)
                uniquePlus, styleArray = uniqueMinus
                */
                //console.log(removeElementFromuniqueArray(uniqueArray(styleArray), selectedCheckbox))
                //selectedCity = undefined;
                //selectedCheckbox = undefined;                
                sampleLayerGeoJSON.setStyle(invisibleStyle1);                
                //console.log(sampleSoilGeoJSON.getStyle())                
            }
        })        
    }
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////


    
    // Cursor style for feature detection on map
    map.on('pointermove', function(evt){
        let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
        if(isFeatureAtPixel){
            map.getViewport().style.cursor = 'pointer';
        }else{
            map.getViewport().style.cursor = '';
        }
    })

    // Feature click on MAP   
    const mapView = map.getView();
    map.on('singleclick', function(evt){
        map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
            try {
                displayFeatureInfo(feature);
                zoomToClickedFeature(feature);
            } catch (err) {
                console.log(`Error has occured: ${err}`)
            }            
        })
    })

    // set content of class="sampleDescription" HTML element
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
        const featureName = feature.get('Helyseg');
        const featureIMG = feature.get('Foto');
        
        if(featureName != undefined && featureName != null){            
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
            cityImageElement.setAttribute('src', './data/static_images/description.png');
            lightboxImageElement.setAttribute('style', `background-image: url('./data/static_images/description.png')`);
            cityNameElement.innerHTML = 'Válasszon mintát!';
            sampleTagElement.innerHTML = `Erdőtag: `;
            sampleFractionElement.innerHTML = `Erdőrészlet: `;
            sampleAreaElement.innerHTML = `Terület:  `;
            sampleDeptElement.innerHTML = `Termőréteg mélység: `;
            sampleSoilElement.innerHTML = `Talajtípus: `;
            sampleDescriptionElement.innerHTML = 'Válasszon ki egy mintát a térképről.';
        }        
    }    

    // Map interaction on selecting a feature
    const selectInteraction = new ol.interaction.Select({
        condition: ol.events.condition.singleClick,
        layers: function(layer){
            return layer.get('title') === 'SampleData';
        },
        style: sampleStyle
    })
    map.addInteraction(selectInteraction)

    // Map animation on selecting a feature
    function zoomToClickedFeature(feature){        
            let featureCoordinates = feature.get('geometry').getCoordinates();            
            mapView.animate({center: featureCoordinates, duration: 1000}, {zoom: 13})
    }

    // Scale line control
    const scaleLineControl = new ol.control.ScaleLine({bar: true});
    map.addControl(scaleLineControl);
}