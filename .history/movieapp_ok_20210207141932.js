//Movie Object structure
//var Movie = {id:"000", name:"Joker", details:"Tragedy"};

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
//Reducers
//===================================================================================================

//Movies reducer
const movies = (state = [], action) => {
  switch (action.type) {
    case "ADD_MOVIE":
      //console.log("MoveName", action.payload.name);
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          details: action.payload.details,
        },
      ];

    case "DELETE_MOVIE":
      //console.log("movieid", movieId);

      //   const index = state.indexOf({
      //     id: action.payload.id,
      //   });

      /* 
      //other way using findindex
      const index = state.findIndex((movie) => {
        console.log("movie", movie);
        return movie.Id == movieId;
      });
      console.log("index:", index);
      return [...state.slice(0, index).concat(state.slice(index + 1))];
      */

      const movieId = action.payload.id;
      //[...state].filter((m) => m.id != movieId);
      // console.log("na", na);
      // console.log("state", state);
      return [...state].filter((m) => m.id != movieId);

    case "UPDATE_MOVIE":
      //

      const movieId = action.payload.id;
      const index = state.findIndex((movie) => movie.movieId == movieId);

      //const movieId = action.payload;
      if (state.id !== action.payload.id) {
        return state;
      }
      return {
        //if it is the selected one then return the Movie and Update Details
        ...state,
        details: action.payload.details,
      };

    //*********************************************** */
    //   //if it is not the selected one return it as it is

    //   console.log("action.id", action.id);
    //   console.log("action.details", action.details);
    //   if (state.id !== action.id) {
    //     return state;
    //   }
    //   return {
    //     //if it is the selected one then return the Movie and Update Details
    //     ...state,
    //     details: action.details,
    //   };
    // //console.log("State", state);
    //*********************************************** */

    default:
      return state;
  }
};

//Methods

const getAllMovies = () => {
  console.log(store.getState());
};

//kareem

const addMovie = (movieName, details = "") => {
  store.dispatch({
    type: "ADD_MOVIE",
    id: Date.now(),
    name: movieName,
    details: details,
  });
};

//using payload
const addMovie2 = (movieName, details = "") => {
  store.dispatch({
    type: "ADD_MOVIE",
    payload: { id: Date.now(), name: movieName, details: details },
  });
};

const deleteMovie = (movieId) => {
  store.dispatch({ type: "DELETE_MOVIE", payload: { id: movieId } });
};

const updateMovie = (movieId, details) => {
  store.dispatch({ type: "UPDATE_MOVIE", id: movieId, details: details });
};

store.subscribe(() => {
  console.log("Store wird erfolgreich aktualisiert");
});

getAllMovies();
