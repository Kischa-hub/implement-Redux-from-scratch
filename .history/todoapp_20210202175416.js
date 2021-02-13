//Reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false,
        },
      ];

    case "TOGGLE_TODO":
      return state.map((todo) => {});

    default:
      return state;
  }
};