//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   for (episode of episodeList) {
//     const movieList = document.getElementById("root").content.cloneNode(true);
//     movieList.querySelector("h1").textContent = episode.name;
//     const season = document.createElement("span");
//     season.textContent = ` - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
//     movieList.querySelector("h1").append(season);
//     movieList.querySelector("img").setAttribute("src", episode.image.medium);
//     movieList.querySelector("p").textContent = episode.summary;
//     document.body.append(movieList);
//   }
// }  


const allEpisodes = getAllEpisodes();
const searchValue = document.getElementById("input");

function forEpisodeCard(episode) {
  const divCard = document.createElement("div");
  divCard.classList.add("episode-card");

  const title = document.createElement("h1");
  title.textContent = episode.name;

  const season = document.createElement("span");
  season.textContent = ` - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  title.appendChild(season);

  const image = document.createElement("img");
  image.src = episode.image.medium;
  image.alt = episode.name;

  const summary = document.createElement("p");
  summary.textContent = episode.summary;

  divCard.appendChild(title);
  divCard.appendChild(image);
  divCard.appendChild(summary);

  return divCard;
}

function setup() {
  makePageForEpisodes(allEpisodes);
  searchValue.addEventListener("input", searchValues);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodesDisplayAmount = document.querySelector(".episodes-amount");
  episodesDisplayAmount.style.border = 'none';
  episodesDisplayAmount.style.backgroundColor = 'transparent';

    // this toRemoveChild mean clear existing code before start new code.
  toRemoveChild(rootElem);

  let searchTerm = searchValue.value.toLowerCase();
  let filteredEpisodeList = filterEpisodeList(episodeList, searchTerm);

  filteredEpisodeList.forEach((episode) => {
    const episodeCard = forEpisodeCard(episode);
    rootElem.appendChild(episodeCard);
  });

  episodesDisplayAmount.textContent = `Episodes match, ${filteredEpisodeList.length} / ${allEpisodes.length}`;
}

function toRemoveChild(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function searchValues() {
  let searchTerm = searchValue.value.toLowerCase();
  makePageForEpisodes(allEpisodes, searchTerm);
}

function filterEpisodeList(episodeList, searchTerm) {
  if (!searchTerm) {
    return episodeList;
  }

  return episodeList.filter((episode) => {
    const searchSource = episode.name.toLowerCase() + episode.summary.toLowerCase();
    return searchSource.includes(searchTerm);
  });
}

window.onload = setup;






