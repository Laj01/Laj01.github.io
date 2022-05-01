
    const mintaObject = {
        Helyseg: ['Bejcgyertyános', 'Csehimindszent', 'Gérce', 'Ikervár', 'Jánosháza', 'Káld', 'Nemeskeresztúr', 'Ölbő', 'Pecöl', 'Sárvár', 'Sitke', 'Sótony', 'Szemenye', 'Vásárosmiske', 'Vashosszúfalu', 'Vát', 'Vép', 'Egyik sem'],
        Melyseg: ['igen sekély', 'sekély', 'középmély', 'mély', 'Egyik sem'],
        Talajtipus: ['Cseri talaj', 'Podzolos cseri talaj', 'Podzolos barna erdőtalaj', 'Öntés erdőtalaj', 'Pszeudoglejes cseri talaj', 'Rozsdabarna erdőtalaj', 'Öntés erdőtalaj', 'Kavicsos váztalaj', 'Barnaföld', 'Réti erdőtalaj', 'Agyagbemosódásos rozsdabarna erdőtalaj', "Egyik sem"]
    };
    
    const cityDropdown = document.querySelector('.navbar > .dropdown > .dropdown-content-select-city');    
    const depthDropdown = document.querySelector('.navbar > .dropdown > .dropdown-content-select-depth');
    const soilDropdown = document.querySelector('.navbar > .dropdown > .dropdown-content-select-soil');

    const cityMenu = 'citySelectorRadioButton'
    const deptmenu = 'depthSelectorRadioButton'
    const soilMenu = 'soilSelectorRadioButton'

    const displayDropdown = function(name, menu, dropdown) {
        name.forEach(function(cn) {
            const html = `
            <label class="container">
                <input type="radio" name="${menu}" value="${cn}" autocomplete="off">${cn}</input>
            </label>`;
            dropdown.insertAdjacentHTML('beforeend', html)
        })
    }

    displayDropdown(mintaObject.Helyseg, cityMenu, cityDropdown);
    displayDropdown(mintaObject.Melyseg, deptmenu, depthDropdown);
    displayDropdown(mintaObject.Talajtipus, soilMenu, soilDropdown);