import { authors } from "./data.js";
import { genres } from "./data.js";
import { books } from "./data.js";
const BOOKS_PER_PAGE = 36;
let page = 1;


//settings querySelectors
const settings = document.querySelector('[data-header-settings]');
const settingsOverlay = document.querySelector('[data-settings-overlay]');
const settingsForm = document.querySelector('[data-settings-form]');
const cancelSettings = document.querySelector('[data-settings-cancel]');
const settingTheme = document.querySelector('[data-settings-theme]');

//This specific event listener allows the search button to be able to be clicked on, and for the pop up overlay to be visible
const search = document.querySelector(".header__button"); // accesses the search button
const searchBtn = document.querySelector('[data-header-search]'); // accesses the search button
const searchOverlay = document.querySelector('[data-search-overlay]');
const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');
const searchCancel = document.querySelector('[data-search-cancel]');
const titleMatch = document.querySelector('[data-search-title]');
const genreMatch = document.querySelector('[data-search-genres]');
const authorMatch = document.querySelector('[data-search-authors]');
const searchSubmitBtn = searchForm.querySelector('button[type = "submit"]');



search.addEventListener("click", () => {
    searchOverlay.show();
    e.preventDefault();
    searchForm.classList.toggle('hidden');
});
// event listener for when the cancel button is clicked, it should close the search menu overlay
const searchCnsl = document.querySelector('[data-search-cancel]');
searchCancel.addEventListener('click', () => {
    searchOverlay.close();
    e.preventDefault();
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchOverlay.close();
});



searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchOverlay.close();
    searchSubmithandler(e);
});


//this function toggles the settings form
settings.addEventListener("click", (e) => {
    settingsOverlay.show();
    e.preventDefault();


});
//this function is for when the cancel button is clicked, it should close the settings menu overlay
const settingsCnsl = document.querySelector('[data-settings-cancel]');

settingsCnsl.addEventListener('click', (e) => {

    settingsOverlay.close();
    e.preventDefault();
    settingsForm.classList.toggle('hidden');
    document.querySelector('[data-settings-overlay]').classList.toggle('hidden')

});
//function to change the theme from light to dark and vice versa
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (settingTheme.value === "day") {
        document.documentElement.style.setProperty("--color-dark", css.light.dark)
        document.documentElement.style.setProperty("--color-light", css.light.light)
    } else {
        document.documentElement.style.setProperty("--color-dark", css.dark.dark)
        document.documentElement.style.setProperty("--color-light", css.dark.light)
    }
    settingsForm.classList.toggle('hidden');
    document.querySelector('[data-settings-overlay]').classList.toggle('hidden')
    settingsOverlay.close();
})



//list and overlay selectors
const list = document.querySelector("[data-list-items]");
const loadMore = document.querySelector("[data-list-button]");
const previewOverlay = document.querySelector("[data-list-active]");
const closeBttn = document.querySelector("[data-list-close]");
const titleOverlay = previewOverlay.querySelector(".overlay__title");
const dataOverlay = previewOverlay.querySelector(".overlay__data");
const overlayBlur = previewOverlay.querySelector(".overlay__blur");
const overlayImage = previewOverlay.querySelector(".overlay__image");
const infoOverlay = previewOverlay.querySelector("[data-list-description]");



if (!books && !Array.isArray(books)) {
    throw new Error('Source required');
}

let startIndex = (page - 1) * BOOKS_PER_PAGE;
let endIndex = BOOKS_PER_PAGE;
let range = [startIndex, endIndex]


if (!range && range.length < 2) {
    throw new Error('Range must be an array with two numbers');
}

const css = {
    light: { dark: '10, 10, 20', light: '255,255,255' },
    dark: { dark: '255,255,255', light: '10,10,20' },
};


//book preview funtionality

function innerHTML(book, index) {
    const div = document.createElement('div');
    div.classList.add('preview');

    div.dataset.id = book.id

    div.innerHTML = `
    <div>
     <img class="preview__image" src="${book.image}">
    </div>
    <div class="preview__info"> 
    <div class="preview__title"> ${book.title}</div>
    <div class="preview__author"> ${authors[book.author]}</div>
    </div>`
    return div;
}


for (let i = 0; i < BOOKS_PER_PAGE; i++) {
    list.appendChild(innerHTML(books[i], i));

}
let loaded = 0;

function moreBooks(event) {

    let booksLeft = books.length - BOOKS_PER_PAGE - loaded;
    let moreBtn = booksLeft > 0 ? booksLeft : 0;
    loadMore.innerHTML =
        `<span>show more</span>
<span class = "list remaining">(${moreBtn})</span>`;

    let booksLoaded = BOOKS_PER_PAGE + loaded;

    for (let i = loaded; i < booksLoaded; i++) {
        list.appendChild(innerHTML(books[i], i));

        //disable show more button when all books have been loaded
        if (i === books.length - 1) {
            loadMore.disabled = true
        }
    }
    loaded = loaded + 36
    //BOOKS_PER_PAGE = BOOKS_PER_PAGE + 36
};



const openOverlay = (e) => {
    const bookPreview = e.target.closest(".preview");
    const index = bookPreview.dataset.index;
    overlayBlur.src = books[index].image;
    overlayImage.src = books[index].image;
    titleOverlay.textContent = books[index].title;
    let dataOverlay = new Date(books[index].published).getFullYear();
    dataOverlay.textContent = `${authors[books[index].author]} (${dataOverlay})`;
    infoOverlay.textContent = books[index].description;

    previewOverlay.show();


};

//adding eventListeners to the buttons

loadMore.addEventListener("click", moreBooks);
list.addEventListener("click", openOverlay);
closeBttn.addEventListener("click", () => {
    previewOverlay.close();
})

const data_search_genres = document.querySelector('[data-search-genres]')
const data_search_authors = document.querySelector('[data-search-authors]')

const Genres = document.createDocumentFragment()
const genreElement = document.createElement('option')
genreElement.dataset.id = ''
genreElement.value = 'any'
genreElement.innerText = 'All Genres'
Genres.appendChild(genreElement)

for (let i = 0; i < Object.entries(genres).length; i++) {
    const [id, name] = Object.entries(genres)[i]
    const element = document.createElement('option')
    element.dataset.id = id
    element.value = name
    element.innerText = name
    Genres.appendChild(element)
}

data_search_genres.appendChild(Genres)

const Authors = document.createDocumentFragment()
const authorElement = document.createElement('option')
authorElement.dataset.id = ''
authorElement.value = 'any'
authorElement.innerText = 'All Authors'
Authors.appendChild(authorElement)

for (let i = 0; i < Object.entries(authors).length; i++) {
    const [id, name] = Object.entries(authors)[i]
    const element = document.createElement('option')
    element.dataset.id = id
    element.value = name
    element.innerText = name
    Authors.appendChild(element)
}

data_search_authors.appendChild(Authors)


















































