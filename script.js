const state = {
  getAllEpisodes: [],
  searchTerm: "",
};

function fetchfilms() {
  return fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}
fetchfilms()
  .then(function (films) {
    if (films) {
      state.getAllEpisodes = films;
    }
  })
  .catch((err) => {
    return "Error occurred";
  });

function setup() {
  const allEpisodes = state.getAllEpisodes;
  makePageForEpisodes(allEpisodes);
  const numb = document.getElementById("num-epis");
  numb.textContent = ` ${allEpisodes.length} `;
  render();
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

 render();

window.onload = setup;
