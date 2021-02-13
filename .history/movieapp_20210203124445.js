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

const movies = (state = [], action) => {
  switch (action.type) {
    case "ADD_MOVIE":
      return [...state, movie(undefined, action)];

    case "ADD_DETAILS":
      return state.map((m) => movie(m, action));

    case "DELETE_MOVIE":
      var indexofitem = state.indexOf(state.id);
      return [
        ...state.slice(0, indexofitem).concat(state.slice(indexofitem + 1)),
      ];
    //fruits.slice(0, 3).concat(fruits.slice(4));

    default:
      return state;
  }
};
