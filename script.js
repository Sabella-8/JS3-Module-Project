function setup() {
  const allEpisodes = state.getAllEpisodes;
  makePageForEpisodes(allEpisodes);
  const numb = document.getElementById("num-epis");
  numb.textContent = " " + allEpisodes.length + " ";
}

function makePageForEpisodes(episodeList) {
  const root = document.createElement("div");
  root.innerHTML = "";
  for (episode of episodeList) {
    const movieList = document.getElementById("root").content.cloneNode(true);
    movieList.querySelector("h1").textContent = episode.name;
    const spu = document.createElement("span");
    spu.textContent = ` - S${String(episode.season).padStart(2, "0")}`;
    movieList.querySelector("h1").append(spu);
    const epu = document.createElement("span");
    epu.textContent = `E${String(episode.number).padStart(2, "0")}`;
    movieList.querySelector("h1").append(epu);
    movieList.querySelector("img").setAttribute("src", episode.image.medium);
    movieList.querySelector("p").textContent = episode.summary;
    root.appendChild(movieList);
  }
  document.body.appendChild(root);
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
    numb.textContent =
      " " + filteredEpisodes.length + "/" + allEpisodes.length + " ";
    makePageForEpisodes(filteredEpisodes);
  });
}

render();
window.onload = setup;
