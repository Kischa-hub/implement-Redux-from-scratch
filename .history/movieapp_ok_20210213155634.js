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
    default:
      return state;
  }
};

//*****************************************Implementing UNDO HISTORY*********************************************************************** */

function undoable(reducer) {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  };

  // Return a reducer that handles undo and redo
  return function (state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
      case "UNDO":
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case "REDO":
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
    }
  };
}

//Make the Movies Reducers Undoable
const undoableMovies = undoable(movies);

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

//Watching List Reducer
//var watchinglist = {userName:"000", movieName:"Joker", startTime ,pauseTime, endTime};

const watchList = (state = [], action) => {
  switch (action.type) {
    case "WATCH_MOVIE":
      return [
        ...state,
        {
          userName: action.payload.userName,
          movieName: action.payload.movieName,
          startTime: action.payload.startTime,
          pauseMinute: action.payload.pauseMinute,
          pauseTime: action.payload.pauseTime,
          endTime: action.payload.endTime,
          remainTime: action.payload.remainTime,
        },
      ];

    case "PAUSE_MOVIE":
      const { userName, movieName } = action.payload;
      // console.log("userName", userName);
      // console.log("movieName", movieName);
      // console.log("state", state);
      //.filter((m) => m.userName !== userName && m.movieName !== movieName)
      return [
        ...state,
        {
          userName: action.payload.userName,
          movieName: action.payload.movieName,
          startTime: action.payload.startTime,
          pauseMinute: action.payload.pauseMinute,
          pauseTime: action.payload.pauseTime,
          endTime: action.payload.endTime,
          remainTime: action.payload.remainTime,
        },
      ];

    // case "UPDATE_MOVIE":
    //   const { id } = action.payload;
    //   return [
    //     ...state.filter((m) => m.id !== id),
    //     {
    //       id: action.payload.id,
    //       name: action.payload.name,
    //       details: action.payload.details,
    //     },
    //];

    case "END_MOVIE":
      //const { userName, movieName } = action.payload;
      return [
        ...state,
        {
          userName: action.payload.userName,
          movieName: action.payload.movieName,
          startTime: action.payload.startTime,
          pauseMinute: action.payload.pauseMinute,
          pauseTime: action.payload.pauseTime,
          endTime: action.payload.endTime,
          remainTime: action.payload.remainTime,
        },
      ];
    default:
      return state;
  }
};

// case "UPDATE_MOVIE":
//   const { id } = action.payload;
//   return [
//     ...state.filter((m) => m.id !== id),
//     {
//       id: action.payload.id,
//       name: action.payload.name,
//       details: action.payload.details,
//     },
//   ];

//Define Store
const store = createStore(
  combineReducers({
    movies: movies,
    users: users,
    watchList: watchList,
    undoableMovies: undoableMovies,
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
  console.log(store.getState().movies);
};

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

const render = (movietitle = "", moviecateogry = "") => {
  document.body.innerHTML = "";
  store.getState().movies.map((m) => {
    let div = document.createElement("div");
    div.classList.add("recipe");

    let h1 = document.createElement("h1");
    h1.textContent = m.name;

    let h3 = document.createElement("h3");
    h3.textContent = m.details;

    let img = document.createElement("img");
    img.src = "joker.gif";
    img.classList.add("image");

    div.appendChild(h1);
    div.appendChild(h3);
    div.appendChild(img);

    document.body.appendChild(div);
  });
};

store.subscribe(() => {
  render();
});

getAllMovies();

const Undo_Movies = () => {
  store.dispatch({
    type: "UNDO",
  });
};

const Redo_Movies = () => {
  store.dispatch({
    type: "REDO",
  });
};

//******************************************************************************************************* */
//Users Methods
//using payload
const addUser = (userId, userName, userPass = "123", isAdmin = false) => {
  store.dispatch({
    type: "ADD_USER",
    payload: {
      userId: userId,
      userName: userName,
      userPass: userPass,
      isAdmin: isAdmin,
    },
  });
};

const getAllUsers = () => {
  console.log(store.getState().users);
};
//******************************************************************************************************* */
//Users Methods

// userName: action.payload.userName,
// movieName: action.payload.name,
// startTime:action.payload.startTime,
// pauseTime:action.payload.pauseTime,
// endTime:action.payload.endTime,
const addWatchedMovie = (
  userName,
  movieName,
  startTime = new Date().toLocaleString(),
  pauseMinute = "",
  pauseTime = "",
  endTime = "",
  remainTime = 90
) => {
  store.dispatch({
    type: "WATCH_MOVIE",
    payload: {
      userName: userName,
      movieName: movieName,
      startTime: startTime,
      pauseMinute: pauseMinute,
      pauseTime: pauseTime,
      endTime: endTime,
      remainTime: remainTime,
    },
  });
};

const pauseMovie = (
  userName,
  movieName,
  pauseMinute,
  endTime = "",
  remainTime = 90
) => {
  let obj = store
    .getState()
    .watchList.find(
      (m) => m.userName === userName && m.movieName === movieName
    );

  var dt = new Date(obj.startTime);
  dt.setMinutes(dt.getMinutes() + pauseMinute);

  store.dispatch({
    type: "PAUSE_MOVIE",
    payload: {
      userName: userName,
      movieName: movieName,
      startTime: obj.startTime,
      pauseMinute: pauseMinute,
      pauseTime: dt,
      endTime: endTime,
      remainTime: obj.remainTime - pauseMinute,
    },
  });
};

const endMovie = (userName, movieName) => {
  let obj = store
    .getState()
    .watchList.find(
      (m) => m.userName === userName && m.movieName === movieName
    );

  var dt = new Date(obj.startTime);
  dt.setMinutes(dt.getMinutes() + 90);

  store.dispatch({
    type: "END_MOVIE",
    payload: {
      userName: userName,
      movieName: movieName,
      startTime: obj.startTime,
      pauseMinute: "",
      pauseTime: "",
      endTime: dt,
      remainTime: 0,
    },
  });
};

const getmoviesbyUser = (userName) => {
  console.log(
    store.getState().watchList.filter((m) => m.userName === userName)
  );
};

const getmovieHistorybyUser = (userName, movieName) => {
  console.log(
    store
      .getState()
      .watchList.filter(
        (m) => m.userName === userName && m.movieName === movieName
      )
  );
};

const getAllwatchedMovie = () => {
  console.log(store.getState().watchList);
};
