const state = {
  getAllEpisodes: [],
  searchTerm: "",
};

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
      return data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

function setup() {
  fetchShows().then(function (shows) {
    const showSelection = document.getElementById("showSelection");

    shows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelection.appendChild(option);
    });

    showSelection.addEventListener("change", function (event) {
      const selectedShowName = event.target.value;
      const selectedShow = shows.find((show) => show.name === selectedShowName);
      fetch(`https://api.tvmaze.com/shows/${selectedShow.id}`)
        .then((res) => res.json())
        .then((selectedShow) => {
          makePageForEpisodes(selectedShow.episodes);
        })
        .catch((error) =>
          console.error("Error fetching selected show:", error)
        );
    });

    state.getAllEpisodes = shows;
    const allEpisodes = state.getAllEpisodes;
    makePageForEpisodes(allEpisodes);
    const numb = document.getElementById("num-epis");
    numb.textContent = ` ${allEpisodes.length} `;
    render();
  });
}

function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");
  root.innerHTML = "";
  for (const episode of episodeList) {
    const movieList = document.createElement("div");
    movieList.innerHTML = `
      <h1>${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}</h1>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p>${episode.summary}</p>
    `;
    root.appendChild(movieList);
  }
}

function render() {
  const searching = document.getElementById("search-bar");
  const allEpisodes = state.getAllEpisodes;
  searching.addEventListener("input", function () {
    state.searchTerm = searching.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(state.searchTerm) ||
        episode.summary.toLowerCase().includes(state.searchTerm)
      );
    });
    const numb = document.getElementById("num-epis");
    numb.textContent = ` ${filteredEpisodes.length}/${allEpisodes.length} `;
    makePageForEpisodes(filteredEpisodes);
  });
}

window.onload = setup;
