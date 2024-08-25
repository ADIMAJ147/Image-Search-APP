const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

async function searchImages() {
  inputData = searchInputEl.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
      searchResultsEl.innerHTML = "";
      showMoreButtonEl.style.display = "none"; // Hide button initially
    }

    const results = data.results;

    if (results.length === 0) {
      searchResultsEl.innerHTML = "<p>No results found. Please try another search term.</p>";
      return;
    }

    results.forEach((result) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("search-result");

      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || "Image";

      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      imageLink.textContent = result.alt_description || "View on Unsplash";

      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      searchResultsEl.appendChild(imageWrapper);
    });

    if (data.total_pages > page) {
      showMoreButtonEl.style.display = "block"; // Show button if more pages are available
    } else {
      showMoreButtonEl.style.display = "none"; // Hide button if no more pages
    }

    page++;
  } catch (error) {
    searchResultsEl.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    console.error("Error fetching images:", error);
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
  searchImages();
});
