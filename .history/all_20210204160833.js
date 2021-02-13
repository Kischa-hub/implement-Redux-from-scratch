//Global Functions

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
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  dispatch({});
  return { getState, dispatch, subscribe };
};
const combineReducers = (reducers) => {
  console.log("hi from combine");
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};
///Reducers

//movies reducers
const moviesReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_MOVIES":
      return [...state];
    case "ADD_MOVIE":
      return [...state, Object.assign({}, action.payload)];
    case "DELETE_MOVIE":
      // return state.filter(movie=>movie.id != action.payload)
      const movieId = action.payload;
      const index = state.findIndex((movie) => movie.movieId == movieId);
      return state.slice(0, index).concat(state.slice(index + 1));
    case "UPDATE_MOVIE":
      let Id = action.payload.movieId;
      const i = state.findIndex((m) => m.movieId == Id);
      return [
        ...state.slice(0, i), // everything before current post
        {
          ...state[i],
          movieName: action.payload.movieName,
        },
        ...state.slice(i + 1), // everything after current post
      ];
    case "ADD_MOVIE_DETAILS":
      let IdMov = action.payload.movieId;
      let indx = state.findIndex((m) => m.movieId == IdMov);
      return [
        ...state.slice(0, indx), // everything before current post
        {
          ...state[indx],
          movieDetails: action.payload.movieDetails,
        },
        ...state.slice(indx + 1), // everything after current post
      ];
    default:
      return state;
  }
};
//ratings reducers
const ratingsReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_ALL_MOVIES_RATINGS":
      return [...state];
    case "RATE_MOVIE":
      const indx = state.findIndex(
        (m) =>
          m.movieId == action.payload.movieId &&
          m.user.userId == action.payload.user.userId
      );
      if (indx == -1) {
        return [...state, Object.assign({}, action.payload)];
      } else {
        return [
          ...state.slice(0, indx), // everything before current post
          {
            ...state[indx],
            rate: action.payload.rate,
          },
          ...state.slice(indx + 1), // everything after current post
        ];
      }
    default:
      return state;
  }
};
//userFavList reducers
const userFavListReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_ALL_FAV_LIST":
      return [...state];
    case "ADD_MOVIE_TO_USER_FAV":
      return [...state, Object.assign({}, action.payload)];
    case "GET_USERS_FAV_MOVIE":
      let users = [];
      state.map((item) => {
        if (item.movieId == action.payload) users.push(item.userId);
      });
      return users;
    default:
      return state;
  }
};
//userWatchList reducers
const userWatchListReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_MOVIES_WATCH_USERS":
      return [...state];
    case "ADD_MOVIE_TO_USER_WATCHLIST":
      const indx = state.findIndex(
        (m) =>
          m.movieId == action.payload.movieId &&
          m.user.userId == action.payload.user.userId
      );
      if (indx == -1) {
        return [...state, Object.assign({}, action.payload)];
      }
    case "PAUSE_MOVIE":
      let utc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      const index = state.findIndex(
        (m) =>
          m.movieId == action.payload.movieId &&
          m.user.userId == action.payload.user.userId
      );

      return [
        ...state.slice(0, index), // everything before current post
        {
          ...state[index],
          watchingDetails: [
            ...state[index].watchingDetails,
            {
              watchedPeriod: action.payload.watchedPeriod,
              pause: true,
              date: utc,
            },
          ],
        },
        ...state.slice(index + 1), // everything after current post
      ];
    case "REPLAY_MOVIE":
      let utcDate = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      const i = state.findIndex(
        (m) =>
          m.movieId == action.payload.movieId &&
          m.user.userId == action.payload.user.userId
      );
      return [
        ...state.slice(0, i), // everything before current post
        {
          ...state[i],
          watchingDetails: [
            ...state[i].watchingDetails,
            { watchedPeriod: 0, pause: false, date: utcDate },
          ],
        },
        ...state.slice(i + 1), // everything after current post
      ];
    case "REMOVE_MOVIE_FROM_WATCHLIST":
      const movieId = action.payload;
      const idx = state.findIndex((movie) => movie.movieId == movieId);
      return state.slice(0, idx).concat(state.slice(idx + 1));

    default:
      return state;
  }
};
const WatchedListReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_MOVIE_TO_WATCHED_LISE":
      return [...state, Object.assign({}, action.payload)];
    case "FETCH_ALL_MOVIES_WATCHED":
      return [...state];
    default:
      return state;
  }
};
//user reducers
const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_USER":
      return [...state, Object.assign({}, action.payload)];
    case "FETCH_USERS":
      return [...state];
    default:
      return state;
  }
};
//current user reducer
const currentUserReducer = (state = [], action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return [...state, Object.assign({}, action.payload)];
    case "FETCH_ALL_LOGIN_USERS":
      return [...state];
    case "lOGOUT_USER":
      const userId = action.payload;
      const index = state.findIndex((movie) => movie.userId == userId);
      return state.slice(0, index).concat(state.slice(index + 1));

    default:
      return state;
  }
};
///store///

const store = createStore(
  combineReducers({
    movies: moviesReducer,
    users: usersReducer,
    ratings: ratingsReducer,
    userWatchList: userWatchListReducer,
    WatchedList: WatchedListReducer,
    userFavList: userFavListReducer,
    currentUser: currentUserReducer,
  })
);

///  Actions//
let nextMovieId = 0;
let nextUserId = 0;
const moviesActions = {
  /// Movies Action//
  fetchMoviesAction: function () {
    store.dispatch({ type: "FETCH_MOVIES" });
    return store.getState().movies;
  },

  deleteMovieAction: function (movieId) {
    store.dispatch({ type: "DELETE_MOVIE", payload: movieId });
  },
  addMovieAction: function (movie) {
    store.dispatch({
      type: "ADD_MOVIE",
      payload: {
        movieId: "m_" + Math.floor(Math.random() * 100),
        movieName: movie.movieName,
        realseDate: movie.movieRealseDate,
        movieURL: movie.movieURL,
        moviePeriod: movie.moviePeriod,
      },
    });
  },
  updateMovieAction: function (movieId, movieName) {
    store.dispatch({
      type: "UPDATE_MOVIE",
      payload: { movieName: movieName, movieId: movieId },
    });
  },
  addMovieDetailsAction: function (movieId, movieDetails) {
    store.dispatch({
      type: "ADD_MOVIE_DETAILS",
      payload: { movieDetails: movieDetails, movieId: movieId },
    });
  },
  /// Ratings Actions//
  rateMoviesAction: function (movieId, rate) {
    if (store.getState().currentUser.length > 0) {
      let userId = store.getState().currentUser[0];
      store.dispatch({
        type: "RATE_MOVIE",
        payload: { movieId: movieId, user: userId, rate: rate },
      });
    } else return "plz login before  rate a movie";
  },
  fetchAllRatings: function () {
    store.dispatch({ type: "FETCH_ALL_MOVIES_RATINGS" });
    return store.getState().ratings;
  },
  fetchUsersRateMovie: function (movieId) {
    let usersRate = [];
    store.getState().ratings.map((item) => {
      if (item.movieId == movieId)
        usersRate.push({ user: item.user, rate: item.rate });
    });
    return usersRate;
  },
  fetchMoviesUserRate: function (userId) {
    if (userId == undefined) userId = store.getState().currentUser[0].userId;
    let userMovies = [];
    store.getState().ratings.map((item) => {
      if (item.user.userId == userId)
        userMovies.push({ movieId: item.movieId, rate: item.rate });
    });
    return userMovies;
  },
  getOverallRateOfMovie: function (movieId) {
    let overAllRate = 0;
    let len = 0;
    store.getState().ratings.map((item) => {
      if (item.movieId == movieId) {
        overAllRate = overAllRate + item.rate;
        len = len + 1;
      }
    });
    return len == 0 ? 0 : overAllRate / len;
  },
  /// Users Actions//
  addUserAction: function (user) {
    store.dispatch({
      type: "ADD_USER",
      payload: {
        userId: "u_" + Math.floor(Math.random() * 100),
        userName: user.userName,
        userEmail: user.userEmail,
      },
    });
  },
  fetchUsersAction: function () {
    store.dispatch({ type: "FETCH_USERS" });
    return store.getState().users;
  },

  /// UserWatchList Actions//
  fetchAllWatchList: function () {
    store.dispatch({ type: "FETCH_MOVIES_WATCH_USERS" });
    return store.getState().userWatchList;
  },
  addMovieToUserWatchList: function (movieId) {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
    if (store.getState().currentUser.length > 0) {
      user = store.getState().currentUser[0];
      return store.dispatch({
        type: "ADD_MOVIE_TO_USER_WATCHLIST",
        payload: {
          movieId: movieId,
          user: user,
          watchingDetails: [{ watchedPeriod: 0, pause: false, date: utc }],
        },
      });
    } else return "plz login before  watch a movie";
  },
  fetchAllUsersWatchMovie: function (movieId) {
    let usersWatch = [];
    store.getState().userWatchList.map((item) => {
      if (item.movieId == movieId) usersWatch.push(item.user);
    });
    return usersWatch;
  },
  fetchMoviesUserWatch: function (userId) {
    if (userId == undefined) userId = store.getState().currentUser[0].userId;
    let userMovies = [];
    store.getState().userWatchList.map((item) => {
      if (item.user.userId == userId)
        userMovies.push({
          movieId: item.movieId,
          watchingDetails: item.watchingDetails,
          user: user,
        });
    });
    return userMovies;
  },
  pauseMoive: function (movieId, watchedPeriod) {
    if (store.getState().currentUser.length > 0) {
      user = store.getState().currentUser[0];
    }
    store.dispatch({
      type: "PAUSE_MOVIE",
      payload: { watchedPeriod: watchedPeriod, movieId: movieId, user: user },
    });
  },
  replayMoive: function (movieId) {
    if (store.getState().currentUser.length > 0) {
      user = store.getState().currentUser[0];
    }
    var periodArr = [];
    const indx = store
      .getState()
      .userWatchList.findIndex(
        (m) => m.movieId == movieId && m.user.userId == user.userId
      );
    for (
      let i = 0;
      i < store.getState().userWatchList[indx].watchingDetails.length;
      i++
    ) {
      periodArr.push(
        store.getState().userWatchList[indx].watchingDetails[i].watchedPeriod
      );
    }
    console.log("you paused movie at " + Math.max(...periodArr) + " Min ");
    store.dispatch({
      type: "REPLAY_MOVIE",
      payload: { movieId: movieId, user: user },
    });

    return store.getState().userWatchList[indx].watchingDetails;
  },
  finishMoive: function (movieId) {
    if (store.getState().currentUser.length > 0) {
      user = store.getState().currentUser[0];
    }
    var pausedNum = 0;
    const indx = store
      .getState()
      .userWatchList.findIndex(
        (m) => m.movieId == movieId && m.user.userId == user.userId
      );
    for (
      let i = 0;
      i < store.getState().userWatchList[indx].watchingDetails.length;
      i++
    ) {
      if (store.getState().userWatchList[indx].watchingDetails[i].pause == true)
        pausedNum = parseInt(pausedNum) + 1;
    }
    watchPartNum =
      store.getState().userWatchList[indx].watchingDetails.length - pausedNum;

    store.dispatch({
      type: "ADD_MOVIE_TO_WATCHED_LISE",
      payload: { movieId: movieId, user: user, watchPartNum: watchPartNum },
    });
    store.dispatch({ type: "REMOVE_MOVIE_FROM_WATCHLIST", payload: movieId });
  },
  fetchAllWatchedList: function () {
    store.dispatch({ type: "FETCH_ALL_MOVIES_WATCHED" });
    return store.getState().WatchedList;
  },
  fetchAllWatchedListOneTime: function () {
    var Arr = [];
    store.getState().WatchedList.map((item) => {
      if (item.watchPartNum == 1) Arr.push(item.movieId);
    });
    return Arr;
  },
  fetchAllWatchedListManyTime: function () {
    var Arr = [];
    store.getState().WatchedList.map((item) => {
      if (item.watchPartNum > 1) Arr.push(item.movieId);
    });
    return Arr;
  },
  /// user FavList Actions//
  addMovieToUserFavList: function (movieId) {
    if (store.getState().currentUser.length > 0) {
      user = store.getState().currentUser[0];
      const indx = store
        .getState()
        .userFavList.findIndex(
          (m) => m.movieId == movieId && m.user.userId == user.userId
        );
      if (indx == -1) {
        return store.dispatch({
          type: "ADD_MOVIE_TO_USER_FAV",
          payload: { movieId: movieId, user: user },
        });
      } else return "you alredy   fav  this movie ";
    } else return "plz login before  fav a movie";
  }, //
  fetchUsersFavMovie: function (movieId) {
    let usersFav = [];
    store.getState().userFavList.map((item) => {
      if (item.movieId == movieId) usersFav.push(item.user);
    });
    return usersFav;
  }, //
  fetchAllFavList: function () {
    store.dispatch({ type: "FETCH_ALL_FAV_LIST" });
    return store.getState().userFavList;
  },
  fetchMoviesUserFav: function (userId) {
    if (userId == undefined) userId = store.getState().currentUser[0].userId;
    let userMovies = [];
    store.getState().userFavList.map((item) => {
      if (item.user.userId == userId) userMovies.push(item.movieId);
    });
    return userMovies;
  }, //

  //general
  loginAction: function (userId, userName) {
    store.dispatch({ type: "LOGIN_USER", payload: { userId, userName } });
    //console.log(("Hello "+userName))
  },
  logOutAction: function (userId) {
    store.dispatch({ type: "lOGOUT_USER", payload: userId });
  },

  fetchAllState: function () {
    return store.getState();
  },
  fetchAllLoginUsers: function () {
    store.dispatch({ type: "FETCH_ALL_LOGIN_USERS" });
    return store.getState().currentUser;
  },
};
