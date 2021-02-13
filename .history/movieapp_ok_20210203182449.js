const movies = (state = [{}], action) => {
  switch (action.type) {
    case "ADD_MOVIE":
      return {
        id: action.payload.id,
        name: action.payload.name,
        details: action.payload.details,
      };
    //action.payload.details

    case "ADD_DETAILS":
      //if it is not the selected one return it as it is

      console.log("action.id", action.id);
      console.log("action.details", action.details);
      if (state.id !== action.id) {
        return state;
      }
      return {
        //if it is the selected one then return the Movie and Update Details
        ...state,
        details: action.details,
      };
    //console.log("State", state);

    default:
      return state;
  }
};
