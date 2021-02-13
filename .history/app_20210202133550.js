//Reducer
function counter(state, action) {
  if (typeof state === "undefined") {
  }
  if (action.type === "INCREMENT") {
    return state + 1;
  } else if (action.type === "DECREMENT") {
    return state - 1;
  } else {
    return state;
  }
  return state;
}
