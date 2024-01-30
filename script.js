//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
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
    document.body.append(movieList);
  }
}
window.onload = setup;
