import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";


//Global query selectors:
// settings query selectors
const settings = document.querySelector("[data-header-settings]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const settingsForm = document.querySelector("[data-settings-form]");
const cancelSettings = document.querySelector("[data-settings-cancel]");

// search query selectors
const search = document.querySelector(".header__button"); 
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchForm = document.querySelector("[data-search-form]");
const searchCancel = document.querySelector("[data-search-cancel]");

const authorMatch = document.querySelector("[data-search-authors]");

// list and overlay query selectors
const list = document.querySelector("[data-list-items]");
const loadMore = document.querySelector("[data-list-button]");
const previewOverlay = document.querySelector("[data-list-active]");
const closeBtn = document.querySelector("[data-list-close]");
const titleOverlay = previewOverlay.querySelector(".overlay__title");
const dataOverlay = previewOverlay.querySelector(".overlay__data");
const overlayBlur = previewOverlay.querySelector(".overlay__blur");
const overlayImage = previewOverlay.querySelector(".overlay__image");
const infoOverlay = previewOverlay.querySelector("[data-list-description]");
let selectedGenre = "All Genres";
let selectedAuthor = "All Authors";

// Book Preview Functionality
/**
 * @param {Object} book
 * @param {number} index
 * @returns {Object} booksElement
 * Creates a book preview element with the book image, title and author.
 * The book preview element is then appended to the list element. The book preview element is then returned.
 * */
const innerHTML = (book, index) => {
  const booksElement = document.createElement("div");
  booksElement.className = "preview";
  booksElement.dataset.index = `${index}`;
  booksElement.id = book.id;
  booksElement.innerHTML = ` <img src = ${book.image} 
  class = 'preview__image'  alt="${book.title} book image"></img>
  <div class="preview__info">
    <h3 class="preview__title">${book.title}</h3>
    <div class="preview__author">${authors[book.author]}</div>
  </div>`;
  return booksElement;
};
for (let i = 0; i < BOOKS_PER_PAGE; i++) {
  list.appendChild(innerHTML(books[i], i));
}
let loaded = 0;
loadMore.innerHTML = `<span>Show More</span>
<span class = "list__remaining">(
    ${books.length - BOOKS_PER_PAGE - loaded}
    )</span>`;

/**
 * @param {Event} e handles the event when the "Load More" button is clicked.
 * The "Load More" button is enabled when there are more books to load.
 * The "Load More" button is disabled when all books have been loaded.
 * */
const moreBooks = (e) => {
  loaded += BOOKS_PER_PAGE;
  let booksLeft = books.length - BOOKS_PER_PAGE - loaded;
  let moreBtn = booksLeft > 0 ? booksLeft : 0;
  
  loadMore.innerHTML = `
  <span>Show more</span>
  <span class = "list__remaining">(${moreBtn})</span>`;
  let booksLoaded = BOOKS_PER_PAGE + loaded;
  for (let i = loaded; i < booksLoaded; i++) {
    list.appendChild(innerHTML(books[i], i));
    // Disable the "Load More" button if all books have been loaded
    if (i === books.length - 1) {
      loadMore.disabled = true;
    }
  }
};


/**
 * @param {Event} e handles the event when the search icon is clicked.
 * The search overlay is displayed when the search icon is clicked.
 * */
const openOverlay = (e) => {
  const bookPreview = e.target.closest(".preview");
  const index = bookPreview.dataset.index;
  overlayBlur.src = books[index].image;
  overlayImage.src = books[index].image;
  titleOverlay.textContent = books[index].title;
  let dateOverlay = new Date(books[index].published).getFullYear();
  dataOverlay.textContent = `${authors[books[index].author]} (${dateOverlay})`;
  infoOverlay.textContent = books[index].description;
  previewOverlay.show();
};

// add event listeners to the buttons
loadMore.addEventListener("click", moreBooks);
list.addEventListener("click", openOverlay);
closeBtn.addEventListener("click", () => {
  previewOverlay.close();
});


// Theme settings functionality
/**
 * @typedef {Object} theme
 * Contains the theme settings for light and dark mode.
 * @property {string} day.dark - The dark mode color for the day theme. @property {string} day.light - The light mode color for the day theme.
 * @property {string} night.dark - The dark mode color for the night theme. @property {string} night.light - The light mode color for the night theme.
 *
 *  @event submit
 *Handles form submission and updates theme settings based on user selection.
 */
settings.addEventListener("click", (e) => {
  settingsOverlay.show();
  e.preventDefault();
  settingsForm.classList.toggle("hidden");
  document.querySelector("[data-settings-overlay]").classList.toggle("hidden");
});

const theme = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },
  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};
settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty(
    "--color-light",
    theme[result.theme].light
  );
  document.documentElement.style.setProperty(
    "--color-dark",
    theme[result.theme].dark
  );
  settingsOverlay.close();
});

// Cancel settings selection functionality
cancelSettings.addEventListener("click", (e) => {
  e.preventDefault();
  settingsOverlay.close();
  settingsForm.classList.toggle("hidden");
  document.querySelector("[data-settings-overlay]").classList.toggle("hidden");
});


// Search Functionality:
/**
 * @param {Event} event handles the event when the search icon is clicked,
 * it should display a search menu overlay with options to search for books
 * 
*/

search.addEventListener("click", (e) => {
  searchOverlay.show();
  e.preventDefault();
  searchForm.classList.toggle("hidden");
});
// event listener for when the cancel button is clicked, it should close the search menu overlay
searchCancel.addEventListener("click", (e) => {
  searchOverlay.close();
  e.preventDefault();
});

// extract the genre names from the genres object
const genreNames = Object.values(genres).filter(
  (val) => typeof val === "string"
);

const genreSelect = document.querySelector("[data-search-genres]");
const genrePlaceholderOption = document.createElement("option");
genrePlaceholderOption.text = "All Genres";
genreSelect.add(genrePlaceholderOption);
genreNames.forEach((genre) => {
  const option = document.createElement("option");
  option.value = genre;
  option.text = genre;
  genreSelect.add(option);
});


/**
 * @param {authorNames} author returns all the author names in the data set as drop down list
 * for the user to select from
 */
// extract the author names from the authors object
const authorNames = Object.values(authors).filter(
  (val) => typeof val === "string"
);

const authorSelect = document.querySelector("[data-search-authors]");
const authorPlaceholderOption = document.createElement("option");
authorPlaceholderOption.text = "All Authors";
authorSelect.add(authorPlaceholderOption);
authorNames.forEach((author) => {
  const option = document.createElement("option");
  option.value = author;
  option.text = author;
  authorSelect.add(option);
});

// add options to the author select dropdown
authorNames.forEach((author) => {
  const option = document.createElement("option");
  option.value = author;
  option.text = author;
  authorMatch.appendChild(option);
});

// Title Search Functionality:
/**
 * @param {Event} event handles the event when the user types in the search bar
 * it should display a list of books that match the search query 
*/

// Genre-author filter functionality
// when user selects specific genre, display books under that genre
genreSelect.addEventListener("change", (e) => {
  selectedGenre = e.target.value;
});
// when user selects specific author, display books under that author
authorSelect.addEventListener("change", (e) => {
  selectedAuthor = e.target.value;
});


searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchOverlay.close();
  list.innerHTML = " ";
  const searchTitle = e.target.value;
  let booksByGenre = [];
  let booksByGenreAndAuthor = [];
  let booksByGenreAndAuthorAndTitle = [];
  
  // If the user selects 'All Genres', display all the books, else, filter the books by the selected genre
  if (selectedGenre.localeCompare("All Genres") == 0) {
    booksByGenre = books;
  } else {
    // get the guid(which is the key) for the genre (which is the value) from the genres object
    let genreGUID;
    for (var key in genres) {
      if (genres[key] === selectedGenre) {
        genreGUID = key;
      }
    }
    for (let i = 0; i < books.length; i++) {
      if (books[i].genres.includes(genreGUID)) {
        booksByGenre.push(books[i]);
      }
    }// if all books within the filter have been loaded, disable the load more button
    if (booksByGenre.length <= BOOKS_PER_PAGE) {
      loadMore.disabled = true;
    }
  } 


  // get all books matching author from the selected genre
  if (selectedAuthor.localeCompare("All Authors") == 0) {
    booksByGenreAndAuthor = booksByGenre;
  } else {
    //get the guid for the genre
    let authorGUID;
    for (var key in authors) {
      if (authors[key] === selectedAuthor) {
        authorGUID = key;
      }
    }
    for (let i = 0; i < booksByGenre.length; i++) {
      if (booksByGenre[i].author.localeCompare(authorGUID) == 0) {
        booksByGenreAndAuthor.push(booksByGenre[i]);
      }
    }
  }

  // get all books matching title search
  if (selectedAuthor.length == 0) {
    booksByGenreAndAuthor = booksByGenreAndAuthor;
  } else {
    //get the guid for the genre
    let searchTitle = document.querySelector("[data-search-title]").value;

    for (let i = 0; i < booksByGenreAndAuthor.length; i++) {
      if (
        booksByGenreAndAuthor[i].title
          .toLowerCase()
          .includes(searchTitle.toLowerCase())
      ) {
        booksByGenreAndAuthorAndTitle.push(booksByGenreAndAuthor[i]);
      }
    }
  }

  for (let i = 0; i < booksByGenreAndAuthorAndTitle.length; i++) {
    list.appendChild(innerHTML(booksByGenreAndAuthorAndTitle[i], i));
  }
  // if no books match the search criteria, display a message to the user
  if (booksByGenreAndAuthor == 0 || booksByGenreAndAuthorAndTitle == 0 || booksByGenre == 0) {
    const noResults = document.querySelector("[data-list-message]");
    noResults.classList.remove("hidden");
  }
  });