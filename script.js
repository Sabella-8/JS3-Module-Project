const state = {
  getAllEpisodes: [],
  getAllShows: [],
  searchTerm: "",
};

function fetchFilms() {
  return fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

function fetchShows() {
  return fetch("https://api.tvmaze.com/shows")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch shows");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

function setup() {
  fetchFilms().then(function (films) {
    state.getAllEpisodes = films;
    const allEpisodes = state.getAllEpisodes;
    makePageForEpisodes(allEpisodes);
    fetchShows().then(function (shows) {
      state.getAllShows = shows;
      createShowDropdownOptions(shows);

      const numb = document.getElementById("num-epis");
      numb.textContent = `${allEpisodes.length}`;
      render();
    });
  });
}

function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");
  root.innerHTML = "";
  episodeList.forEach((episode) => {
    const movieList = document.createElement("div");
    movieList.className = "episode-card";
    let imgLink =
      "https://tse4.mm.bing.net/th?id=OIP.SMN6FoUeIDOheKokwHCX_wHaHa&pid=Api&P=0&h=180";
    if (episode.image.medium !== null) {
      imgLink = episode.image.medium;
    }
    movieList.innerHTML = `
      <h1 class="title">${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}</h1>
        <img src="${imgLink}" alt="${episode.name}">
        <p>${episode.summary}</p>
        `;
    root.appendChild(movieList);
  });
  episodeTitle();
}

const selectEpisodes = document.getElementById("select-episode");
const episodeTitle = () => {
  selectEpisodes.innerHTML = "";
  let episodeCards = [...document.querySelectorAll(".title")];
  episodeCards.forEach((episode) => {
    const option = document.createElement("option");
    option.textContent = episode.innerHTML;
    selectEpisodes.appendChild(option);
  });

  //Cut this code from this line to 109, and create a new function and call the function here
  let episodeContainers = [...document.querySelectorAll(".episode-card")];
  selectEpisodes.addEventListener("change", function () {
    const selectedValue = selectEpisodes.value;
    episodeContainers.forEach((content) => {
      if (content.innerHTML.includes(selectedValue)) {
        content.style.display = "block"; //show
      } else {
        content.style.display = "none"; //hide
      }
    });
  });
};
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

const selectShows = document.getElementById("select-show");
function createShowDropdownOptions(shows) {
  selectShows.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select show";
  selectShows.appendChild(defaultOption);

  //short show Alphabetically
  shows.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: "base" })); // localeCompare is a method which compare name with (a, b). sensitivity: 'base' mean case sensitive and not influenced by case variations mean like 'é' and 'e' .

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id; // we use show.id as a identifier like "123, game, show123, 8400-e29b-41d4-a716-446, ABC_XYZ_123"
    option.textContent = show.name;
    selectShows.appendChild(option);
  });

  selectShows.addEventListener("change", function () {
    const selectedShowId = selectShows.value;
    console.log("here");
    showEpisodesForSelectedShow(selectedShowId);
  });
}

function showEpisodesForSelectedShow(showId) {
  if (showId === "") {
    makePageForEpisodes(state.getAllEpisodes);
  } else {
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`) // we use here in URL "{showId} = 123 "to allow user to add there show number in link "https://api.tvmaze.com/shows/123/episodes"
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch episodes for the selected show");
        }
        return res.json();
      })
      .then((episodes) => {
        makePageForEpisodes(episodes);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

function showMovieCard(selectedValue) {
  const allEpisodes = state.getAllEpisodes;
  const selectedEpisode = allEpisodes.find((episode) => {
    return (
      `${episode.name} - S${String(episode.season).padStart(2, 0)}E${String(
        episode.number
      ).padStart(2, 0)}` === selectedValue
    );
  });
  // Display the corresponding movie card
  makePageForEpisodes([selectedEpisode]);
}

window.onload = setup;
