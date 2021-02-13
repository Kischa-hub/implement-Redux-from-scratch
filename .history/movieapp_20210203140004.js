//Movie Object
//var Movie = {id:"000", name:"Joker", details:"Tragedy"};

//Movie Reducer
const movie = (state = {}, action) => {
  switch (action.type) {
    case "ADD_MOVIE":
      return { id: action.id, name: action.name, details: action.details };

    case "ADD_DETAILS":
      //if it is not the selected one return it as it is
      if (state.id !== action.id) {
        return state;
      }
      return {
        //if it is the selected one then return the Movie and Update Details
        ...state,
        details: state.details,
      };

    default:
      return state;
  }
};

//Movies Reducer
const movies = (state = [], action) => {
  switch (action.type) {
    case "ADD_MOVIE":
      return [...state, movie(undefined, action)];

    case "ADD_DETAILS":
      return state.map((m) => movie(m, action));

    case "DELETE_MOVIE":
      var indexofitem = state.indexOf({ name: state.name });
      //var indexofitem = state.findIndex((x) => x.name === state[0].name);
      console.log(indexofitem);
      console.log(state.name);
      return [
        ...state.slice(0, indexofitem).concat(state.slice(indexofitem + 1)),
      ];

    default:
      return state;
  }
};
//=========================================================================================================
//redux Store
//createstore without Redux Lib from scratch
const createStore = (reducer) => {
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      //not understand this line
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  dispatch({});

  return { getState, dispatch, subscribe };
};

//Define Store
const store = createStore(movies);

//===================================================================================================
//Methods

const getAllMovies = () => {
  console.log(store.getState());
};

const addMovie = (movieName, details = "") => {
  store.dispatch({
    type: "ADD_MOVIE",
    id: Date.now(),
    name: movieName,
    details: details,
  });
};

const deleteMovie = (movieId) => {
  store.dispatch({ type: "DELETE_MOVIE", id: movieId });
};
//store.dispatch({ type: "INCREMENT" });
//store.dispatch({ type: "DECREMENT" });

store.subscribe(() => {
  console.log("Store wird erfolgreich aktualisiert");
});

getAllMovies();
