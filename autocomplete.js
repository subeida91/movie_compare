const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    //we are creating the dropdown html here
root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;


//we are selecting html to manipulate
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');


const onInput = async event => {
//when you write someting in the input fetch data
const items = await fetchData(event.target.value);

// if we get back no results from our search we should close our dropdown. if there are no movies lets return early and not return anything else here.
  if (!items.length){
    dropdown.classList.remove('is-active');
    return;
  }

//to clear the results when you make a new search
  resultsWrapper.innerHTML= "";

  dropdown.classList.add('is-active');
  //we are looping over movies and creating some html anchor tags and then append them to resultswrapper. we are adding is-active to dropdown. we call our anchor tag option. classList.add adds a class dropdown-item to option.
  for (let item of items) {
    const option = document.createElement('a');

    option.classList.add('dropdown-item');
    option.innerHTML = renderOption(item);

    //if someone clicks on the anchor links (option) we want to update the value of the input to be the movie and we want to close the drop down menu.
    option.addEventListener("click", () => {
      dropdown.classList.remove('is-active');
      //we want to change the input value
      input.value = inputValue(item);

        //we created this function in another document. 
        onOptionSelect(item);
    });
    //append the anchors to the html
    resultsWrapper.appendChild(option);
  }
};

//now we are using the debounce function. what ever comes outside of fetchdata we want to asign it to movies. now we have fetched every movie, we want to grab them with a for loop and create a div for them.
input.addEventListener('input', debounce(onInput, 500));

//we want to close the dropdown if user clicks anywhere not including the dropdown. outside of the root is where we are intersted in and we want to remove its class to close it.
document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active');
  }
});
}