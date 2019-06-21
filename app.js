const resultsList = document.querySelector('.results-list');
const searchInput = document.querySelector('.search-bar');
const colourSearch = document.querySelector('.colour-search');
const resetFiltersButton = document.querySelector('.reset-filters');
const noResults = `<div class="no-results">No Results Found</div>`;
let tempData = [];
let searchedData = [];
let filterData = {
    'makes': [],
    'names': [],
    'sizes': [],
    'colours': [],
    'ratings': [],
    'releaseYears': [],
}

// -------- Results List --------
const sizeMarkup = (sizes) => {
    let markup = ``;
    sizes.map(size => {markup += `<li class="size">${size}</li>`});
    return markup;
}

const colorsMarkup = (colours) => {
    let markup = ``;

    colours.map(color => markup += `<li class="color-item color-${color}">${color}</li>`);
    return markup;
}

const displayResults = (data) => {
    let itemMarkup = '';
    data.map(shoe => {
        const { id, make, model, sizes, colours, rating, releaseYear, image } = shoe;
        let markup =
        `
            <li class="shoe-item" data-shoe-id="${id}">
                <div class="info">
                    <div class="make">${make}</div>
                    <div class="model">${model}</div>
                    <ul class="sizes">${sizeMarkup(sizes)}</ul>
                    <ul class="colours">${colorsMarkup(colours)}</ul>
                    <div class="rating">${rating}</div>
                    <div class="release-year">${releaseYear}</div>
                </div>
            </li>
        `;
        itemMarkup += markup;
    });
    resultsList.innerHTML = itemMarkup;
}

// -------- Search --------
function resetFilters(event) {
    event.preventDefault();
    console.log(this);
}

function filterColours() {
    const colourFilter = tempData.store.filter(shoe => {
        return shoe.colours.includes(this.value);
    });
    colourFilter.length > 0 ? displayResults(colourFilter) : resultsList.innerHTML = '';
}

const coloursToSearch = (theData) => {
    let colourMarkup = ``;
    theData.colours.forEach(colour => {
        colourMarkup += `
        <label class="colour-checkbox">
            <input type="checkbox" value="${colour}" id="colour${colour}"/>
            <span class="checkbox" style="background:${colour};"></span>
        </label>
        `;
    });
    return colourMarkup;
}

const createFilters = (data) => {
    colourSearch.innerHTML = coloursToSearch(data);
}

const returnResults = (searchedWord) => {
    return tempData.store.filter(shoe => {
        const regex = new RegExp(searchedWord, 'gi');
        return (shoe.make.match(regex) || shoe.model.match(regex));
    });
}

function performSearch() {
    resultsList.innerHTML = '';
    let tempArray = [...returnResults(this.value)];
    (tempArray.length > 0) ? displayResults(tempArray) : resultsList.innerHTML = noResults;
}

const formatFilters = (theArray, shoeInfo) => {
    if (!theArray.includes(shoeInfo)) {
        theArray.push(shoeInfo);
    }
}

const setupFilterData = (data) => {
    data.store.map(shoe => {
        const { make, model, sizes, colours, rating, releaseYear } = shoe;
        formatFilters(filterData.makes, make);
        formatFilters(filterData.names, model);
        sizes.map(size => formatFilters(filterData.sizes, size));
        colours.map(colour => formatFilters(filterData.colours, colour));
        formatFilters(filterData.ratings, rating);
        formatFilters(filterData.releaseYears, releaseYear);
    });
    filterData.sizes.sort((a, b) => a - b);
    filterData.releaseYears.sort((a, b) => a - b);
    createFilters(filterData);
}

const expandSearchBox = () => {
    searchInput.classList.toggle('focused');
}

// -------- Modal --------
const showHideModal = () => {
    document.querySelector('.modal').classList.toggle('show-modal');
}

function toggleItemModal() {
    showHideModal();
    const theModal = document.querySelector('.modal-content');
    const shoeId = this.getAttribute('data-shoe-id');
    const theShoe = tempData.store.find(shoe => {
        return shoe.id === shoeId;
    });
    console.log({theShoe});
    theModal.innerHTML = `
        <img class="modal-image" src="${theShoe.image}" alt="${theShoe.model}-shoe" />
        <div class="modal-info">
            <h2 class="make-model">${theShoe.make} - ${theShoe.model}</h2>
            <p class="release-year">Release Year: ${theShoe.releaseYear}</p>
            <p class="retail-price">Retail Price: ${theShoe.retailPrice}</p>
        </div>
        <span class="close-button">&times;</span>
    `;
}

function windowOnClick(e) {
    if (e.target === document.querySelector('.modal')) {
        showHideModal();
    }
    if (e.target.matches('.close-button')) {
        showHideModal();
    }
}

searchInput.addEventListener('keyup', performSearch);
searchInput.addEventListener('blur', expandSearchBox);
searchInput.addEventListener('focus', expandSearchBox);

resetFiltersButton.addEventListener('click', resetFilters, false);

const load = () => {
    colourSearch.querySelectorAll('.colour-checkbox input').forEach(colourFilter => colourFilter.addEventListener('click', filterColours), false);
    document.querySelectorAll('.shoe-item').forEach(item => item.addEventListener('click', toggleItemModal), false);
    // document.querySelector('.modal').addEventListener('click', showHideModal, false);
    window.addEventListener('click', windowOnClick, false);
}
window.onload = load;

const sendData = (data) => {
    tempData = data;
    setupFilterData(tempData);
    displayResults(tempData.store);
}

fetch('store.json')
    .then((response) => response.json())
    .then(data => sendData(data))
    .catch(err => {
        console.error(err);
    });
