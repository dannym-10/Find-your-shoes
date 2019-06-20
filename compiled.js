'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var resultsList = document.querySelector('.results-list');
var searchInput = document.querySelector('.search-bar');
var colourSearch = document.querySelector('.colour-search');
var resetFiltersButton = document.querySelector('.reset-filters');
var noResults = '<div class="no-results">No Results Found</div>';
var tempData = [];
var searchedData = [];
var filterData = {
    'makes': [],
    'names': [],
    'sizes': [],
    'colours': [],
    'ratings': [],
    'releaseYears': []

    // -------- Results List --------
};var sizeMarkup = function sizeMarkup(sizes) {
    var markup = '';
    sizes.map(function (size) {
        markup += '<li class="size">' + size + '</li>';
    });
    return markup;
};

var colorsMarkup = function colorsMarkup(colours) {
    var markup = '';
    colours.map(function (color) {
        return markup += '<li class="color-item color-' + color + '">' + color + '</li>';
    });
    return markup;
};

var displayResults = function displayResults(data) {
    var itemMarkup = '';
    data.map(function (shoe) {
        var id = shoe.id,
            make = shoe.make,
            model = shoe.model,
            sizes = shoe.sizes,
            colours = shoe.colours,
            rating = shoe.rating,
            releaseYear = shoe.releaseYear,
            image = shoe.image;

        var markup = '\n            <li class="shoe-item" data-shoe-id="' + id + '">\n                <div class="image-wrapper">\n                    <img src="" alt="">\n                </div>\n                <div class="info">\n                    <div class="make">' + make + '</div>\n                    <div class="model">' + model + '</div>\n                    <ul class="sizes">' + sizeMarkup(sizes) + '</ul>\n                    <ul class="colours">' + colorsMarkup(colours) + '</ul>\n                    <div class="rating">' + rating + '</div>\n                    <div class="release-year">' + releaseYear + '</div>\n                </div>\n            </li>\n        ';
        itemMarkup += markup;
    });
    resultsList.innerHTML = itemMarkup;
};

// -------- Search --------
function resetFilters(event) {
    event.preventDefault();
    console.log(this);
}

function filterColours() {
    var _this = this;

    var colourFilter = tempData.store.filter(function (shoe) {
        return shoe.colours.includes(_this.value);
    });
    colourFilter.length > 0 ? displayResults(colourFilter) : resultsList.innerHTML = '';
}

var coloursToSearch = function coloursToSearch(theData) {
    var colourMarkup = '';
    theData.colours.forEach(function (colour) {
        colourMarkup += '\n        <label class="colour-checkbox">\n            <input type="checkbox" value="' + colour + '" id="colour' + colour + '"/>\n            <span class="checkbox" style="background:' + colour + ';"></span>\n        </label>\n        ';
    });
    return colourMarkup;
};

var createFilters = function createFilters(data) {
    colourSearch.innerHTML = coloursToSearch(data);
};

var returnResults = function returnResults(searchedWord) {
    return tempData.store.filter(function (shoe) {
        var regex = new RegExp(searchedWord, 'gi');
        return shoe.make.match(regex) || shoe.model.match(regex);
    });
};

function performSearch() {
    resultsList.innerHTML = '';
    var tempArray = [].concat(_toConsumableArray(returnResults(this.value)));
    tempArray.length > 0 ? displayResults(tempArray) : resultsList.innerHTML = noResults;
}

var formatFilters = function formatFilters(theArray, shoeInfo) {
    if (!theArray.includes(shoeInfo)) {
        theArray.push(shoeInfo);
    }
};

var setupFilterData = function setupFilterData(data) {
    data.store.map(function (shoe) {
        var make = shoe.make,
            model = shoe.model,
            sizes = shoe.sizes,
            colours = shoe.colours,
            rating = shoe.rating,
            releaseYear = shoe.releaseYear;

        formatFilters(filterData.makes, make);
        formatFilters(filterData.names, model);
        sizes.map(function (size) {
            return formatFilters(filterData.sizes, size);
        });
        colours.map(function (colour) {
            return formatFilters(filterData.colours, colour);
        });
        formatFilters(filterData.ratings, rating);
        formatFilters(filterData.releaseYears, releaseYear);
    });
    filterData.sizes.sort(function (a, b) {
        return a - b;
    });
    filterData.releaseYears.sort(function (a, b) {
        return a - b;
    });
    createFilters(filterData);
};

var expandSearchBox = function expandSearchBox() {
    searchInput.classList.toggle('focused');
};

//Modal stuff
var showHideModal = function showHideModal() {
    console.log('clocked');
    document.querySelector('.modal').classList.toggle('show-modal');
};

function toggleModal() {
    showHideModal();
    var theModal = document.querySelector('.modal-content');
    var shoeId = this.getAttribute('data-shoe-id');
    var theShoe = tempData.store.find(function (shoe) {
        return shoe.id === shoeId;
    });
    theModal.innerHTML += '\n        <h2>' + theShoe.make + ' - ' + theShoe.model + '</h2>\n    ';
}

function windowOnClick(e) {
    if (e.target === document.querySelector('.modal')) {
        showHideModal();
    }
}

function stuff() {
    console.log('likshff');
}

searchInput.addEventListener('keyup', performSearch);
searchInput.addEventListener('blur', expandSearchBox);
searchInput.addEventListener('focus', expandSearchBox);

resetFiltersButton.addEventListener('click', resetFilters, false);

var load = function load() {
    colourSearch.querySelectorAll('.colour-checkbox input').forEach(function (colourFilter) {
        return colourFilter.addEventListener('click', filterColours);
    }, false);
    document.querySelectorAll('.shoe-item').forEach(function (item) {
        return item.addEventListener('click', toggleModal);
    }, false);
    document.querySelector('.modal .close-button').addEventListener('click', showHideModal); //FIX THIS
    window.addEventListener('click', windowOnClick, false);
};
window.onload = load;

var sendData = function sendData(data) {
    tempData = data;
    setupFilterData(tempData);
    displayResults(tempData.store);
};

fetch('store.json').then(function (response) {
    return response.json();
}).then(function (data) {
    return sendData(data);
}).catch(function (err) {
    console.error(err);
});
