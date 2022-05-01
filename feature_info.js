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