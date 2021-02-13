//Reducer
const counter = (state = 0, action) => {
  //   if (typeof state === "undefined") {
  //     //return the default value
  //     return 0;
  //   }
  //   if (action.type === "INCREMENT") {
  //     return state + 1;
  //   } else if (action.type === "DECREMENT") {
  //     return state - 1;
  //   } else {
  //     return state;
  //   }
  //   return state;
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const { createStore } = Redux;
const store = createStore(counter);
