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
//=========================================================================================================

//combine Reducer
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};
//=========================================================================================================

//===================================================================================================
//Reducers
//===================================================================================================
//Movie Object structure
//var Movie = {id:"000", name:"Joker", details:"Tragedy"};
//Movies reducer
const movies = (state = [], action) => {
  switch (action.type) {
    case "ADD_MOVIE":
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          details: action.payload.details,
        },
      ];

    case "DELETE_MOVIE":
      const movieId = action.payload.id;
      return [...state].filter((m) => m.id != movieId);

    case "UPDATE_MOVIE":
      const { id } = action.payload;
      return [
        ...state.filter((m) => m.id !== id),
        {
          id: action.payload.id,
          name: action.payload.name,
          details: action.payload.details,
        },
      ];

    // case "GET_MOVIE":
    //   const getid = action.payload.id;
    //   const currentMovie = [...state].filter((m) => m.id == getid);
    //   return currentMovie;
    default:
      return state;
  }
};

//User Object structure
//var Movie = {userId:"000", userName:"Joker", userPass:"**",isAdmin:true};
//User reducer
const users = (state = [], action) => {
  switch (action.type) {
    case "ADD_USER":
      return [
        ...state,
        {
          userId: action.payload.userId,
          userName: action.payload.userName,
          userPass: action.payload.userPass,
          isAdmin: action.payload.isAdmin,
        },
      ];
    default:
      return state;
  }
};

//Define Store
const store = createStore(movies);
const store = createStore(
  combineReducers({
    movies: movies,
    users: users,
    // ratings: ratingsReducer,
    // userWatchList: userWatchListReducer,
    // WatchedList: WatchedListReducer,
    // userFavList: userFavListReducer,
    // currentUser: currentUserReducer,
  })
);

//************************************************************************************************************************* */

//Methods Movies

const getAllMovies = () => {
  console.log(store.getState());
};

//kareem

//using payload
const addMovie = (movieid, movieName, details = "") => {
  store.dispatch({
    type: "ADD_MOVIE",
    // payload: { id: Math.random() * 11, name: movieName, details: details },
    payload: { id: movieid, name: movieName, details: details },
  });
};

const deleteMovie = (movieId) => {
  store.dispatch({ type: "DELETE_MOVIE", payload: { id: movieId } });
};

// const getMovie = (movieId) => {
//   store.dispatch({ type: "GET_MOVIE", payload: { id: movieId } });
// };

const updateMovie = (movieId, movieName, details) => {
  store.dispatch({
    type: "UPDATE_MOVIE",
    payload: { id: movieId, name: movieName, details: details },
  });
};

store.subscribe(() => {
  console.log("Store wird erfolgreich aktualisiert");
});

getAllMovies();

//******************************************************************************************************* */
//Users Methods
//using payload
const ADD_USER = (userId, userName, userPass = "555", isAdmin = false) => {
  store.dispatch({
    type: "ADD_MOVIE",
    // payload: { id: Math.random() * 11, name: movieName, details: details },
    //{userId:"000", userName:"Joker", userPass:"**",isAdmin:true};
    payload: {
      userId: userId,
      userName: userName,
      userPass: userPass,
      isAdmin: isAdmin,
    },
  });
};
