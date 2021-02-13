//Reducer
function counter(state, action) {
  if (action.type === "INCREMENT") {
    return state + 1;
  }
  return state;
}
