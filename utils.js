// //we added an event listener, when the user searches for this film, we are passing this as an argument for the fetchdata function. everytime we do a keypress we do a seach which is not ideal so we added a delay of actually typing a sentence and calling fetchdata. we are saying let the user do as much typing as they want if there is a delay of half a second then search.cleaTimeout stops the function from being called. This is called debouncing an input. Debouncing an input is waiting for some time to pass after the last event to actually do something. we are debouncing the onInput. is timeoutId defined if it is stop it from running. we basially created a guard inside func, so that it only runs after the delay we want it to have. the args is saying, take however much arguments are passed through. this is code you can use to decide how often a funciton can be invoked. we set a default ammount.

const debounce = (func, delay = 1000) => {
    let timeoutId;
    return(...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
      timeoutId = setTimeout(() => {
         func.apply(null, args);  
       }, delay) 
    }
}