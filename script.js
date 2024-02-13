//You can edit ALL of the code here
function setup() {
  const allEpisodes = data.getAllEpisodes;
  makePageForEpisodes(allEpisodes);
  const episodesLength = document.getElementById("count-episodes");
  episodesLength.textContent = " " + allEpisodes.length + " ";
}

function makePageForEpisodes(episodeList) {
  for (episode of episodeList) {
    const movieList = document.getElementById("root").content.cloneNode(true);
    movieList.querySelector("h1").textContent = episode.name;
    const season = document.createElement("span");
    season.textContent = ` - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    movieList.querySelector("h1").append(season);
    movieList.querySelector("img").setAttribute("src", episode.image.medium);
    movieList.querySelector("p").textContent = episode.summary;
    
    document.body.appendChild(movieList);
  }
} 

// const arr = data.searchTerm 
// console.log(arr)

function render() {
  const search = document.getElementById("search-input");
  console.log(search.value)
  const allEpisodes = data.getAllEpisodes;
  console.log(allEpisodes)
  search.addEventListener("input", function () {
    // const allEpisodes = data.getAllEpisodes;
    data.searchTerm = search.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(data.searchTerm) ||
        episode.summary.toLowerCase().includes(data.searchTerm)
      );
    });
    const countNumb = document.getElementById("count-episodes");
    countNumb.textContent =
      " " + filteredEpisodes.length + "/" + allEpisodes.length + " ";
    makePageForEpisodes(filteredEpisodes);
  });
}

 render();

window.onload = setup;

