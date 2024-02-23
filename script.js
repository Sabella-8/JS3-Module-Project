const getEpisodes = document.getElementById("selectEpisodes");
const getShow = document.getElementById("selectShow");
const Home = document.getElementById("home");
const search = document.getElementById("search");
const root = document.getElementById("root");
const allShows = [];
let specialEp = [];
let clickedEpisodes = [];

function fetchShows() {
  return fetch("https://api.tvmaze.com/shows")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch shows");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      allShows.push(...data);
      getAllShows();
      displayShow(data);
      render();
      return data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

function attachH2EventListeners() {
  const h2Elements = root.querySelectorAll(".forEpisode");
  h2Elements.forEach((h2) => {
    h2.addEventListener("click", function () {
      search.value = "";
      const episodeName = this.textContent.trim();
      const selectedEpisode = clickedEpisodes.find(
        (episode) => episode.name === episodeName
      );
      if (selectedEpisode) {
        // If episode is already fetched, just use it
        displayEpisodes(clickedEpisodes);
      } else {
        // Find the show associated with the clicked episode
        const selectedShow = allShows.find((show) => show.name === episodeName);
        if (selectedShow) {
          fetchEpisodes(selectedShow.id)
            .then((episodes) => {
              displayEpisodes(episodes);
              populateEpisodeDropdown(episodes);
              clickedEpisodes.push(
                ...episodes.map((episode) => ({
                  ...episode,
                  showId: selectedShow.id,
                }))
              );
            })
            .catch((error) => {
              console.error("Error fetching episodes:", error);
            });
        }
      }
    });
  });
}

function fetchShowsAndAttachListeners() {
  fetchShows()
    .then(() => {
      attachH2EventListeners();
    })
    .catch((error) => {
      console.error("Error fetching shows:", error);
    });
}

fetchShowsAndAttachListeners();

function getAllShows() {
  getEpisodes.innerHTML = "";
  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.textContent = show.name;
    getEpisodes.appendChild(option);
  });
}

getEpisodes.addEventListener("change", function () {
  const showValue = this.value;
  console.log("Selected Show:", showValue);
  root.innerHTML = "";
  getShow.innerHTML = "";
  search.value = "";
  const selectedShow = allShows.find((show) => show.name === showValue);
  if (selectedShow) {
    const clickedShowEpisodes = clickedEpisodes.filter(
      (episode) => episode.showId === selectedShow.id
    );
    if (clickedShowEpisodes.length > 0) {
      displayEpisodes(clickedShowEpisodes);
    } else {
      fetchEpisodes(selectedShow.id);
    }
  }
});

getShow.addEventListener("change", function () {
  search.value = "";
  const selectedSpecificEpisode = this.value;
  console.log("Selected Specific Episode:", selectedSpecificEpisode);
  root.innerHTML = "";
  const filteredEpisodes = specialEp.filter((episode) =>
    episode.name.includes(selectedSpecificEpisode)
  );
  if (filteredEpisodes.length > 0) {
    displayEpisodes(filteredEpisodes);
  }
});

function createCard(episode) {
  const episodeDiv = document.createElement("div");
  episodeDiv.setAttribute("id", "container");
  episodeDiv.innerHTML = `
      <h2 class="forEpisode">${episode.name} - S${String(
    episode.season
  ).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p class="forSummary">${episode.summary}</p>
  `;
  root.appendChild(episodeDiv);
}

function createCardShow(episode) {
  const episodeDiv = document.createElement("div");
  episodeDiv.setAttribute("id", "container");
  const diving = document.createElement("div");
  diving.innerHTML = `
      <h2 class="forEpisode">${episode.name}</h2><img src="${episode.image.medium}" alt="${episode.name}">
  `;
  const divbott = document.createElement("div");
  const divu = document.createElement("div");
  divbott.setAttribute("id", "conta");
  divu.innerHTML = `<p class="forSummary">${episode.summary}</p> 
     `;
  const divgene = document.createElement("div");
  divgene.innerHTML = ` <p class="forSummary"> Rating: ${episode.rating.average}</p> <p class="forSummary">Genres: ${episode.genres}
      </p> <p class="forSummary">Status: ${episode.status}</p>  <p class="forSummary">Runtime: ${episode.runtime}</p>`;
  divbott.append(divu);
  divbott.append(divgene);
  episodeDiv.append(diving);
  episodeDiv.append(divbott);
  root.appendChild(episodeDiv);
}

function displayEpisodes(episodes) {
  root.innerHTML = "";
  specialEp = episodes;
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.textContent = episode.name;
    getShow.appendChild(option);
    createCard(episode);
  });
}
function displayShow(episodes) {
  root.innerHTML = "";
  specialEp = episodes;
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.textContent = episode.name;
    getShow.appendChild(option);
    createCardShow(episode);
  });
}

function fetchEpisodes(showId) {
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return response.json();
    })
    .then((data) => {
      displayEpisodes(data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
    });
}

function populateEpisodeDropdown(episodes) {
  getShow.innerHTML = "";
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.textContent = episode.name;
    getShow.appendChild(option);
  });
}
function render() {
  search.addEventListener("input", function () {
    const searchValue = search.value.toLowerCase();
    root.innerHTML = "";

    const filteredShows = allShows.filter((show) =>
      show.name.toLowerCase().includes(searchValue)
    );
    const filteredShowSummary = allShows.filter((show) =>
      show.summary.toLowerCase().includes(searchValue)
    );
    const filteredEpisodeSummary = specialEp.filter((show) =>
      show.summary.toLowerCase().includes(searchValue)
    );
    const filteredEpisodes = specialEp.filter((episode) =>
      episode.name.toLowerCase().includes(searchValue)
    );

    if (filteredShows.length > 0 && specialEp.length === 0) {
      filteredShows.forEach((show) => {
        createCard(show);
      });
    } else if (specialEp.length > 0) {
      filteredEpisodes.forEach((episode) => {
        createCard(episode);
      });
    } else {
      const noMatchMessage = document.createElement("p");
      noMatchMessage.textContent = "No matching shows or episodes found.";
      root.appendChild(noMatchMessage);
    }
  });
}
Home.addEventListener("click", function () {
  root.innerHTML = "";
  fetchShowsAndAttachListeners();
});
