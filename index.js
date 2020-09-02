const autoCompleteConfig = {
  renderOption(movie){
    //how to show an individual item. if there are no images there is an n/a console error. if this is a truth expression than don't show anything on the dom 
    const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
  `;
},
//what to fill into the input value when someone clicks on one.
inputValue(movie){
return movie.Title
},

//how to fetch the data. we are making a network request. data is the information we  get back from the request
async fetchData(searchTerm) {
const response = await axios.get('http://www.omdbapi.com/', {
  params: {
      apikey: 'f5f71ae8',
      s: searchTerm
 
  }  
});
//if there is an error in what the user types, just return an empty array. this gets rid of error in console.
if (response.data.Error){
    return [];
}
//we want to return whats inside the Search array from the API
return response.data.Search;
}
};
//i want to create an instance of autocomplete widgit
createAutoComplete({
  ...autoCompleteConfig,
  //what to do when someone clicks on one.
//specify where to render the autocomplete to
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie){
    //hide the tutorial
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});

createAutoComplete({
  ...autoCompleteConfig,
//specify where to render the autocomplete to
  root: document.querySelector('#right-autocomplete'),
  //what to do when someone clicks on one.
onOptionSelect(movie){
  //hide the tutorial
  document.querySelector('.tutorial').classList.add('is-hidden');
  onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
}
});

let leftMovie;
let rightMovie
//we are creating a function thats grabs expanded information about the film
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);
//when to compare
  if (side === 'left'){
    leftMovie = response.data;
  } else{
    rightMovie = response.data
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

//comparing the stats of two movies

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) =>  {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  })
}
//Now we want to display the movie information. movieDetail is the object with all the movie details. when you are referncing a javascript variable you need the dollar sign and curly brackets.
const movieTemplate = movieDetail => {
  //remove dollar sign and comma, parseInt turn it into a number
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));

  const metascore = parseInt(movieDetail.Metascore);

  const imdbRating = parseFloat(movieDetail.imdbRating);

  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/\$/g, '').replace(/,/g, ''));

  //we are removing the space from the awards property and we just get tehe element words in an array
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
//this is how you check if a value is not a number
    if (isNaN(value)) {
      return prev;
    }else{
      return prev + value;
    }
  }, 0);
  console.log(awards)

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value =${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value =${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value =${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>  
    <article data-value =${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value =${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
`;
};
